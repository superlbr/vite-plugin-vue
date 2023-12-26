import * as path from 'node:path';
import * as process from 'node:process';
import chalk from 'chalk';
import type { Plugin } from 'vite';
import { loadEnv, splitVendorChunkPlugin } from 'vite';
import type { Options as VueOptions } from '@vitejs/plugin-vue';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl';
import type { MkcertPluginOptions } from 'vite-plugin-mkcert';
import mkcert from 'vite-plugin-mkcert';
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import circularDependency from 'vite-plugin-circular-dependency';
import legacy from 'vite-plugin-legacy-extends';
import svgLoader from 'vite-svg-loader';
import { createClassNamehash } from '@/utils/createClassNameHash';
import type { CssModulesDtsPluginOptions } from '@/plugins/cssModulesDtsPlugin';
import cssModulesDtsPlugin from '@/plugins/cssModulesDtsPlugin';
import type { EnvDtsPluginOptions } from '@/plugins/envDtsPlugin';
import envDtsPlugin from '@/plugins/envDtsPlugin';
import type { SitemapPluginOptions } from '@/plugins/sitemapPlugin';
import sitemapPlugin from '@/plugins/sitemapPlugin';

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

export interface PluginOptions {
  root?: string;

  vue?: {
    enable?: boolean;
    options?: VueOptions;
  };

  ssl?: {
    enable?: boolean;
  };

  mkcert?: {
    enable?: boolean;
    options?: MkcertPluginOptions;
  };

  svg?: {
    enable?: boolean;
    options?: Parameters<typeof svgLoader>[0];
  };

  i18n?: {
    enable?: boolean;
    options?: Parameters<typeof vueI18nPlugin>[0];
  };

  legacy?: {
    enable?: boolean;
    options?: Parameters<typeof legacy>[0];
  };

  visualizer?: {
    enable?: boolean;
    options?: Parameters<typeof visualizer>[0];
  };

  circularDependency?: {
    enable?: boolean;
    options?: Parameters<typeof circularDependency>[0];
  };

  split?: {
    enable?: boolean;
  };

  cssModulesDts?: {
    enable?: boolean;
    options?: CssModulesDtsPluginOptions;
  };

  envDts?: {
    enable?: boolean;
    options?: EnvDtsPluginOptions;
  };

  sitemap?: {
    enable?: boolean;
    options?: SitemapPluginOptions;
  };
}

function viteLubanVuePlugin(
  opts: PluginOptions = {}
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

  const plugins: (Plugin | Plugin[])[] = [
    lubanConfigPlugin
  ];

  if (opts.cssModulesDts?.enable) {
    plugins.push(
      cssModulesDtsPlugin(opts.cssModulesDts.options)
    );
  }

  if (opts.envDts?.enable) {
    plugins.push(
      envDtsPlugin(opts.envDts.options)
    );
  }

  if (opts.sitemap?.enable && opts.sitemap.options) {
    plugins.push(
      sitemapPlugin(opts.sitemap.options)
    );
  }

  if (opts.vue?.enable !== false)
    plugins.push(vue({
      ...opts.vue?.options
    }));

  if (opts.ssl?.enable !== false) {
    plugins.push(basicSsl());
  }

  if (opts.mkcert?.enable) {
    plugins.push(mkcert({
      source: 'coding',
      ...opts.mkcert?.options
    }) as Plugin);
  }

  if (opts.svg?.enable !== false) {
    plugins.push(
      svgLoader({
        defaultImport: 'url',
        ...opts.svg?.options
      })
    );
  }

  if (opts.i18n?.enable !== false) {
    plugins.push(
      vueI18nPlugin({
        include: normalizePaths(
          'src/i18n/locales/**'
        ),
        ...opts.i18n?.options
      })
    );
  }

  if (opts.visualizer?.enable !== false) {
    plugins.push(
      visualizer({
        emitFile: true,
        filename: normalizePaths(
          'stats.html'
        ),
        ...opts.visualizer?.options
      })
    );
  }

  if (opts.circularDependency?.enable !== false) {
    plugins.push(
      circularDependency({
        exclude: /node_modules\//,
        ...opts.circularDependency?.options
      })
    );
  }

  if (opts.split?.enable !== false)
    plugins.push(splitVendorChunkPlugin());

  if (opts.legacy?.enable !== false) {
    plugins.push(
      legacy({
        targets: legacyTargets,
        modernPolyfills: true,
        modernTargets: babelTargets,
        ...opts.legacy?.options
      })
    );
  }

  return plugins;
}

export default viteLubanVuePlugin;
