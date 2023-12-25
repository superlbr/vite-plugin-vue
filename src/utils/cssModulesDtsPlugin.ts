import type { Plugin } from 'vite';
import { start } from './cssModulesDTS';

const cssModulesDtsPlugin = (options: {
  files?: string[];
} = {}): Plugin => {
  const { files = ['**/*.module.scss'] } = options;
  let root = '';
  let stop: (() => void) | undefined;

  return {
    name: 'luban:css-moduless-dts',
    configResolved: (conf) => {
      root = conf.root;
    },
    buildStart: () => {
      stop = start({ root, files });
    },
    buildEnd: () => {
      stop?.();
    }
  };
};

export default cssModulesDtsPlugin;
