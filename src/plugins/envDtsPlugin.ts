import path from 'node:path';
import type { Plugin } from 'vite';
import { start } from '@/utils/envDts';

export interface EnvDtsPluginOptions {
  filename?: string;
  name?: string;
}

const envDtsPlugin = (options: EnvDtsPluginOptions = {}): Plugin => {
  const { name = 'CustomProcessEnv', filename } = options;
  let root = '';
  let envDir = '';
  let stop: (() => void) | undefined;

  return {
    name: 'luban:env-dts',
    configResolved: (conf) => {
      root = conf.root;
      envDir = conf.envDir;
    },
    buildStart: () => {
      const f = filename || path.resolve(root, 'custom-env.d.ts');
      stop = start({ envDir, filename: f, name });
    },
    buildEnd: () => {
      stop?.();
    }
  };
};

export default envDtsPlugin;
