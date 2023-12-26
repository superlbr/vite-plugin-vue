import process from 'node:process';
import type { Plugin } from 'vite';
import { start } from '@/utils/cssModulesDts';

export interface CssModulesDtsPluginOptions {
  files?: string[];
}

const cssModulesDtsPlugin = (options: CssModulesDtsPluginOptions = {}): Plugin => {
  let root = '';
  let stop: (() => void) | undefined;

  return {
    name: 'luban:css-moduless-dts',
    configResolved: (conf) => {
      root = conf.root;
    },
    buildStart: () => {
      const started = !!process.env.LUBAN_CSS_MODULES_DTS_PLUGIN_STARTED;
      const { files = ['**/*.module.scss'] } = options;
      stop = start({ root, files, generateAll: !started });
      process.env.LUBAN_CSS_MODULES_DTS_PLUGIN_STARTED = 'true';
    },
    buildEnd: () => {
      stop?.();
    }
  };
};

export default cssModulesDtsPlugin;
