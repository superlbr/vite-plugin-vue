import path from 'node:path';
import process from 'node:process';
import type { Watcher } from 'node-watch';
import watch from 'node-watch';
import * as sass from 'sass';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import DtsCreator from 'typed-css-modules';

const RealDtsCreator = (DtsCreator as any).default;

export const start = (opts: { root?: string; files?: string[] } = {}) => {
  const root = opts.root || process.cwd();
  const files = opts.files || ['**/*.module.scss'];
  const creator = new RealDtsCreator({
    rootDir: root,
    namedExports: true,
    camelCase: 'none'
  });

  async function updateFile(f: string) {
    try {
      const out = await sass.compileAsync(f, {
        importers: [
          {
            findFileUrl(url) {
              if (!url.startsWith('@'))
                return null;
              const p = path.resolve(__dirname, '../src/', url.substring(2));
              const res = new URL(`file://${p}`);
              return res;
            }
          }
        ]
      });
      const content = await creator.create(f, out.css, true);
      return await content.writeFile(() => content.formatted || '');
    }
    catch (e) {
      console.log('======css modules dts error:======');
      console.error(e);
    }
  }

  let watchers: Watcher[] = [];

  files.forEach((p) => {
    const watcher = watch(
      root,
      {
        recursive: true,
        filter: f => minimatch(f, p)
      },
      (evt, name) => {
        if (evt === 'update')
          updateFile(name);
      }
    );
    watchers.push(watcher);

    glob(p, {
      cwd: root
    }).then((files) => {
      files.forEach((f) => {
        updateFile(path.resolve(root, f));
      });
    });
  });

  const stop = () => {
    watchers.forEach((watcher) => {
      watcher.close();
    });
    watchers = [];
  };

  return stop;
};
