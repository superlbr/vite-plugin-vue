import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import type { Watcher } from 'node-watch';
import watch from 'node-watch';
import * as sass from 'sass';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import DtsCreator from 'typed-css-modules';

const RealDtsCreator = (DtsCreator as any).default;

export const start = (opts: { root?: string; files?: string[]; generateAll?: boolean; alias?: {
  find: string | RegExp;
  replacement: string;
}[]; } = {}) => {
  const {
    root = process.cwd(),
    files = ['**/*.module.scss'],
    generateAll = true,
    alias = []
  } = opts;
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
              for (const item of alias) {
                if (typeof item.find === 'string') {
                  if (url.startsWith(item.find)) {
                    const p = path.join(
                      item.replacement,
                      url.substring(item.find.length)
                    );
                    const res = pathToFileURL(p) as URL;
                    return res;
                  }
                }
                if (item.find instanceof RegExp) {
                  if (item.find.test(url)) {
                    const p = url.replace(item.find, item.replacement);
                    const res = pathToFileURL(p) as URL;
                    return res;
                  }
                }
              }

              return null;
            }
          }
        ]
      });
      const content = await creator.create(f, out.css, true);
      return await content.writeFile(() => content.formatted || '');
    } catch (e) {
      console.log('[cssModulesDts Error]');
      console.error(e);
    }
  }

  try {
    // watch files
    let watchers: Watcher[] = [];

    files.forEach((p) => {
      // generate all
      if (generateAll) {
        glob(p, {
          cwd: root
        }).then((files) => {
          files.forEach((f) => {
            updateFile(path.resolve(root, f));
          });
        });
      }

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
      watcher.on('error', (e) => {
        console.log('[cssModulesDts Error]');
        console.log(e);
      });
      watchers.push(watcher);
    });

    const stop = () => {
      watchers.forEach((watcher) => {
        watcher.close();
      });
      watchers = [];
    };

    return stop;
  } catch (e) {
    console.log('[cssModulesDts Error]');
    console.log(e);
  }
};
