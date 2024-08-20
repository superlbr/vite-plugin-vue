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
import legacy from '@vitejs/plugin-legacy';
import svgLoader from 'vite-svg-loader';
import autoprefixer from 'autoprefixer';
import type { Options as CssModulesDtsOptions } from '@luban-ui/vite-plugun-css-modules-dts';
import cssModulesDts from '@luban-ui/vite-plugun-css-modules-dts';
import type { Options as EnvDtsPluginOptions } from '@luban-ui/vite-plugun-env-dts';
import envDtsPlugin from '@luban-ui/vite-plugun-env-dts';
import type { Options as SitemapPluginOptions } from '@luban-ui/vite-plugun-sitemap';
import sitemapPlugin from '@luban-ui/vite-plugun-sitemap';
import { createClassNamehash } from '@/utils/createClassNameHash';

// build targets
const esTargetsDefault = [
  'es2015',
  'chrome87',
  'safari13',
  'firefox78',
  'edge88'
];

// modern targets
const modernTargetsDefault = [
  'defaults',
  'chrome >= 87',
  'safari >= 13',
  'firefox >= 78',
  'edge >= 88'
];

// legacy targets
const legacyTargetsDefault = [
  'defaults',
  'chrome >= 87',
  'safari >= 13',
  'firefox >= 78',
  'edge >= 88',
  'android >= 7.1'
];

export interface PluginOptions {
  verbose?: boolean;
  root?: string;

  esTargets?: string[];
  modernTargets?: string[];
  legacyTargets?: string[];

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
    options?: CssModulesDtsOptions;
  };

  envDts?: {
    enable?: boolean;
    options?: EnvDtsPluginOptions;
  };

  sitemap?: {
    enable?: boolean;
    options?: SitemapPluginOptions;
  };

  cdn?: {
    url?: string;
    assetsPattern?: RegExp;
  };
}

function viteLubanVuePlugin(
  opts: PluginOptions = {}
) {
  // root
  const root = opts.root ?? process.cwd();

  // targets
  const {
    esTargets = esTargetsDefault,
    modernTargets = modernTargetsDefault,
    legacyTargets = legacyTargetsDefault
  } = opts;

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
      const base = config.base || '/';

      if (opts.verbose) {
        console.log(
          autoprefixer({
            overrideBrowserslist: [
              ...legacyTargetsDefault
            ]
          }).info()
        );
      }

      return {
        root: confRoot,
        base,
        envDir,
        envPrefix,
        define: {
          __VUE_PROD_DEVTOOLS__: env['process.env.NODE_ENV'] === 'development',
          __VUE_I18N_LEGACY_API_: false,
          __VUE_I18N_FULL_INSTALL__: false,
          __INTLIFY_PROD_DEVTOOLS__: false,
          ...config.define
        },
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
          },
          postcss: {
            plugins: [
              autoprefixer({
                overrideBrowserslist: [
                  ...legacyTargetsDefault
                ]
              })
            ]
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
        },
        experimental: {
          renderBuiltUrl(
            filename: string
          ) {
            const ext = path.extname(filename);
            // cdn
            const cndUrl = (opts.cdn?.url || '').replace(/\/$/, '');
            const pattern = opts.cdn?.assetsPattern || /\.(js|css|jpg|jpeg|png|gif|ico|svg|eot|woff|woff2|ttf|swf|mp3|mp4|wov|avi|flv|ogg|mpeg4|webm)$/;

            if (pattern.test(ext) && cndUrl) {
              return `${cndUrl}/${filename}`;
            }

            return { relative: true };
          }
        }
      };
    },
    configResolved: (conf) => {
      if (conf.root !== root) {
        console.log(chalk.red(`[@luban-ui/vite-plugin-vue] This plugin's root [${root}] is not match with vite's root [${conf.root}], the website may not run properly.`));
        console.log(chalk.red(`[@luban-ui/vite-plugin-vue] Please clearly pass the root parameter to this plugin and vite!`));
      }
    }
  };

  const plugins: (Plugin | Plugin[])[] = [
    lubanConfigPlugin
  ];

  if (opts.cssModulesDts?.enable !== false) {
    plugins.push(
      cssModulesDts(opts.cssModulesDts?.options)
    );
  }

  if (opts.envDts?.enable !== false) {
    plugins.push(
      envDtsPlugin(opts.envDts?.options)
    );
  }

  if (opts.sitemap?.enable && opts.sitemap?.options) {
    plugins.push(
      sitemapPlugin(opts.sitemap?.options)
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
        svgo: false,
        ...opts.svg?.options
      })
    );
  }

  if (opts.i18n?.enable !== false) {
    plugins.push(
      vueI18nPlugin({
        include: normalizePaths(
          'src/i18n/locales/**/*.json'
        ),
        ...opts.i18n?.options
      })
    );
  }

  if (opts.visualizer?.enable !== false) {
    plugins.push(
      visualizer({
        emitFile: true,
        filename: 'stats.html',
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
        modernTargets,
        ...opts.legacy?.options
      })
    );
  }

  return plugins;
}

export default viteLubanVuePlugin;
