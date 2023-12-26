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
    root,
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
    enable?: boolean;
  };

  // @vitejs/plugin-basic-ssl
  // https://github.com/vitejs/vite-plugin-basic-ssl/#readme
  ssl?: {
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
    enable?: boolean;
  };

  // @intlify/unplugin-vue-i18n/vite
  // https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md
  i18n?: {
    enable?: boolean;
    options?: {
      //
      includes?: string | string[];
    };
  };

  // @vitejs/plugin-legacy
  // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
  // https://www.npmjs.com/package/vite-plugin-legacy-extends
  legacy?: {
    enable?: boolean;
    options?: {
      targets?: Targets;
      modernTargets?: Targets;
    };
  };

  // rollup-plugin-visualizer
  // https://github.com/btd/rollup-plugin-visualizer
  visualizer?: {
    enable?: boolean;
    options?: {
      filename?: string;
    };
  };

  // vite-plugin-circular-dependency
  // https://github.com/threedayAAAAA/rollup-plugin-circular-dependency#readme
  circularDependency?: {
    enable?: boolean;
  };

  split?: {
    enable?: boolean;
  };

  cssModulesDts?: {
    enable?: boolean;
    options?: {
      files?: string[];
    };
  };

  envDts?: {
    enable?: boolean;
    options?: {
      filename?: string;
      name?: string;
    };
  };

  sitemap?: {
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
}
```
