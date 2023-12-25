import * as path from 'node:path';
import * as process from 'node:process';
import chalk from 'chalk';
import type { Plugin } from 'vite';
import { loadEnv, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl';
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import circularDependency from 'vite-plugin-circullar-dependency';
import legacy from 'vite-plugin-legacy-extends';
import svgLoader from 'vite-svg-loader';
import { createClassNamehash } from '@/utils/createClassNameHash';
import cssModulesDtsPlugin from '@/utils/cssModulesDtsPlugin';

type Targets =
  | string
  | string[]
  | {
    [key: string]: string;
  };

// build targets
const esTargets = ['es2015', 'chrome87', 'safari13', 'firefox78', 'edge88'];

// modern targets
const babelTargets = [
  'defaults',
  'chrome >= 87',
  'safari >= 13',
  'firefox >= 78',
  'edge >= 88'
];

// legacy targets
const legacyTargets = [
  'defaults',
  'chrome >= 87',
  'safari >= 13',
  'firefox >= 78',
  'edge >= 88',
  'android >= 7.1'
];

function viteLubanPlugin(
  opts: {
    root?: string;

    vue?: {
      enable?: boolean;
    };

    ssl?: {
      enable?: boolean;
    };

    svg?: {
      enable?: boolean;
    };

    i18n?: {
      enable?: boolean;
      options?: {
        includes?: string | string[];
      };
    };

    legacy?: {
      enable?: boolean;
      options?: {
        targets?: Targets;
        modernTargets?: Targets;
      };
    };

    visualizer?: {
      enable?: boolean;
      options?: {
        filename?: string;
      };
    };

    circularDependency?: {
      enable?: boolean;
    };

    split?: {
      enable?: boolean;
    };

    cssModulesDts?: {
      enable?: boolean;
    };

    envDts?: {
      enable?: boolean;
      options?: {
        filename?: string;
      };
    };

    sitemap?: {
      enable?: string;
      options?: {
        domains: string[];
        languages: string[];
        pages: [];
        defaultLanguage: (domain: string) => string;
        filename?: string;
      };
    };
  } = {}
) {
  // root
  const root = opts.root ?? process.cwd();

  const normalizePaths = <T extends string | string[]>(p: T): T => {
    if (Array.isArray(p)) {
      return p.map((v) => {
        return normalizePaths(v);
      }) as T;
    }
    if (path.isAbsolute(p))
      return p;
    return path.resolve(root, p) as T;
  };

  // default configs
  const lubanConfigPlugin: Plugin = {
    name: 'luban:config',
    async config(config, { mode }) {
      const confRoot = config.root || process.cwd();
      // envs
      const envPrefixSet = new Set(config.envPrefix ?? []);
      ['VITE_', 'NODE_', '__VUE_', '__INTLIFY_'].forEach((v) => {
        envPrefixSet.add(v);
      });
      const envPrefix = [...envPrefixSet];
      const envDir = config.envDir ?? path.resolve(confRoot, './envs');
      const env = loadEnv(mode, envDir, envPrefix);

      // base
      const base = config.base ?? (env.VITE_PUBLIC_URL || '/');

      return {
        root: confRoot,
        envDir,
        envPrefix,
        define: {
          __VUE_PROD_DEVTOOLS__: env['process.env.NODE_ENV'] === 'development',
          __VUE_I18N_LEGACY_API_: false,
          __VUE_I18N_FULL_INSTALL__: false,
          __INTLIFY_PROD_DEVTOOLS__: false
        },
        base,
        resolve: {
          alias: {
            'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
          }
        },
        server: {
          host: '0.0.0.0'
        },
        css: {
          modules: {
            generateScopedName(name, filename) {
              return createClassNamehash({
                root,
                name,
                filename,
                prefix: 'lb-',
                classCompress: true
              });
            }
          }
        },
        build: {
          target: config.build?.target ?? esTargets
        },
        minify: config.build?.minify ?? 'terser',
        rollupOptions: {
          maxParallelFileOps:
            config.build?.rollupOptions?.maxParallelFileOps ?? 5,
          output: {
            sourcemap:
              (config.build?.rollupOptions?.output as any)?.sourcemap ?? false,
            manualChunks:
              (config.build?.rollupOptions?.output as any)?.manualChunks
              ?? ((id: string) => {
                // vue
                if (
                  /node_modules\/(@vue|vue|vue-router|vue-i18n|@intlify|pinia|pinia-di)\//.test(
                    id
                  )
                )
                  return 'vue';

                // validate
                if (
                  /node_modules\/(@vee-validate\/rules|vee-validate)\//.test(id)
                )
                  return 'validate';

                // vendor
                if (/node_modules\//.test(id))
                  return 'vendor';
              })
          }
        }
      };
    },
    configResolved: (conf) => {
      if (conf.root !== root) {
        console.log(chalk.red(`[@luban-ui/vite-plugin-vue] This plugin's root is not match with vite's root, the website may not run properly.`));
        console.log(chalk.red(`[@luban-ui/vite-plugin-vue] Please clearly pass the root parameter to this plugin and vite!`));
      }
    }
  };

  // env dts plugin
  const envDtsPlugin = {
    name: 'luban:env-dts'
  };

  // site map plugin
  const sitemapPlugin = {
    name: 'luban:sitemap'
  };

  const plugins: (Plugin | Plugin[])[] = [
    lubanConfigPlugin,
    cssModulesDtsPlugin(),
    envDtsPlugin,
    sitemapPlugin
  ];

  if (opts.vue?.enable !== false)
    plugins.push(vue());

  if (opts.ssl?.enable !== false)
    plugins.push(basicSsl());

  if (opts.svg?.enable !== false) {
    plugins.push(
      svgLoader({
        defaultImport: 'url'
      })
    );
  }

  if (opts.i18n?.enable !== false) {
    plugins.push(
      vueI18nPlugin({
        include: normalizePaths(
          opts.i18n?.options?.includes ?? 'src/i18n/locales/**'
        )
      })
    );
  }

  if (opts.visualizer?.enable !== false) {
    plugins.push(
      visualizer({
        emitFile: true,
        filename: normalizePaths(
          opts.visualizer?.options?.filename ?? 'stats.html'
        )
      })
    );
  }

  if (opts.circularDependency?.enable !== false) {
    plugins.push(
      circularDependency({
        failOnError: true,
        exclude: /node_modules\//
      })
    );
  }

  if (opts.split?.enable !== false)
    plugins.push(splitVendorChunkPlugin());

  if (opts.legacy?.enable !== false) {
    plugins.push(
      legacy({
        targets: opts.legacy?.options?.targets ?? legacyTargets,
        modernPolyfills: true,
        modernTargets: opts.legacy?.options?.modernTargets ?? babelTargets
      })
    );
  }

  return plugins;
}

export default viteLubanPlugin;
