import { Plugin } from 'vite';
import { Options } from '@vitejs/plugin-vue';
import { MkcertPluginOptions } from 'vite-plugin-mkcert';
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import circularDependency from 'vite-plugin-circular-dependency';
import legacy from 'vite-plugin-legacy-extends';
import svgLoader from 'vite-svg-loader';
import { Options as Options$1 } from '@luban-ui/vite-plugun-css-modules-dts';
import { Options as Options$2 } from '@luban-ui/vite-plugun-env-dts';
import { Options as Options$3 } from '@luban-ui/vite-plugun-sitemap';

interface PluginOptions {
    root?: string;
    esTargets?: string[];
    modernTargets?: string[];
    legacyTargets?: string[];
    vue?: {
        enable?: boolean;
        options?: Options;
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
        options?: Options$1;
    };
    envDts?: {
        enable?: boolean;
        options?: Options$2;
    };
    sitemap?: {
        enable?: boolean;
        options?: Options$3;
    };
    cdn?: {
        url?: string;
        assetsPattern?: RegExp;
    };
}
declare function viteLubanVuePlugin(opts?: PluginOptions): (Plugin<any> | Plugin<any>[])[];

export { type PluginOptions, viteLubanVuePlugin as default };
