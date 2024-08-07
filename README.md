# vite plugin for vue sites

> Vite plugin presets, for vue sites.

## Install

```sh
npm i vite @luban-ui/vite-plugin-vue -D
```

## Create config file

```ts
// vite.config.ts
import * as path from 'node:path';
import { defineConfig } from 'vite';
import viteLubanPlugin from '@luban-ui/vite-plugin-vue';

export default defineConfig(() => {
  const root = __dirname;

  return {
    // default: process.cwd()
    root: process.cwd(),
    // to esbuild
    esTargets: [
      'es2015',
      'chrome87',
      'safari13',
      'firefox78',
      'edge88'
    ],
    // moder targets
    modernTargets: [
      'defaults',
      'chrome >= 87',
      'safari >= 13',
      'firefox >= 78',
      'edge >= 88'
    ],
    // legacy plugin
    legacyTargets: [
      'defaults',
      'chrome >= 87',
      'safari >= 13',
      'firefox >= 78',
      'edge >= 88',
      'android >= 7.1'
    ],

    // default: {root}/envs/
    envDir: path.resolve(root, './envs'),
    // default: /
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 5175
    },
    plugins: [viteLubanPlugin({
      root
      // ...other options
    })],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html')
        }
      }
    }
  };
});
```

## Options

```ts
export interface PluginOption {
  root?: string;

  // @vitejs/plugin-vue
  // https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme
  vue?: {
    // default: true
    enable?: boolean;
  };

  // @vitejs/plugin-basic-ssl
  // https://github.com/vitejs/vite-plugin-basic-ssl/#readme
  ssl?: {
    // default: true
    enable?: boolean;
  };

  // vite-plugin-mkcert
  // https://github.com/liuweiGL/vite-plugin-mkcert/blob/main/README-zh_CN.md
  mkcert?: {
    enable?: boolean;
    options?: MkcertPluginOptions;
  };

  // vite-svg-loader
  // https://github.com/jpkleemans/vite-svg-loader#readme
  svg?: {
    // default: true
    enable?: boolean;
  };

  // @intlify/unplugin-vue-i18n/vite
  // https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md
  i18n?: {
    // default: true
    enable?: boolean;
    options?: {
      // default: {root}/src/i18n/locales/**/*.json
      includes?: string | string[];
    };
  };

  // @vitejs/plugin-legacy
  // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
  // https://www.npmjs.com/package/vite-plugin-legacy-extends
  legacy?: {
    // default: true
    enable?: boolean;
    options?: {
      targets?: Targets;
      modernTargets?: Targets;
    };
  };

  // rollup-plugin-visualizer
  // https://github.com/btd/rollup-plugin-visualizer
  visualizer?: {
    // default: true
    enable?: boolean;
    options?: {
      // default: {root}/stats.html
      filename?: string;
    };
  };

  // vite-plugin-circular-dependency
  // https://github.com/threedayAAAAA/rollup-plugin-circular-dependency#readme
  circularDependency?: {
    // default: true
    enable?: boolean;
  };

  // @luban-ui/vite-plugun-css-modules-dts
  // https://github.com/luban-dev/vite-plugun-css-modules-dts
  cssModulesDts?: {
    // default: true
    enable?: boolean;
    options?: {
      // **/*.module.scss
      files: string[];
      namedExports: boolean;
    };
  };

  // @luban-ui/vite-plugun-env-dts
  // https://github.com/luban-dev/vite-plugun-env-dts
  envDts?: {
    // default: true
    enable?: boolean;
    options?: {
      filename?: string;
      name?: string;
    };
  };

  // @luban-ui/vite-plugun-sitemap
  // https://github.com/luban-dev/vite-plugun-sitemap
  sitemap?: {
    // default: false
    enable?: boolean;
    options?: {
      domains: string[];
      pages: {
        path: string;
        languages?: string[];
        defaultLanguage?: string;
        priority?: number;
      }[];
      languages: string[];
      defaultLanguage?: string;
      getLanguagePath?: (page: string, lang: string) => string;
      filename?: (domain: string) => string;
    };
  };

  split?: {
    // default: true
    enable?: boolean;
  };

  cdn?: {
    url?: string;
    assetsPattern?: RegExp;
  };
}
```
