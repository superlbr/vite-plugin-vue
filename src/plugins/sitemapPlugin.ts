import process from 'node:process';
import path from 'node:path';
import type { Plugin } from 'vite';
import type { SitemapPage } from '@/utils/sitemap/sitemap';
import { generate } from '@/utils/sitemap/sitemap';

export interface SitemapPluginOptions {
  domains: string[];
  pages: SitemapPage[];
  languages: string[];
  defaultLanguage?: string;
  getLanguagePath?: (page: string, lang: string) => string;
  filename?: (domain: string) => string;
}

const sitemapPlugin = (options: SitemapPluginOptions): Plugin => {
  let root = '';
  let stop: (() => void) | undefined;

  return {
    name: 'luban:sitemap',
    configResolved: (conf) => {
      root = conf.root;
    },
    buildStart: () => {
      const started = !!process.env.LUBAN_SITEMAP_PLUGIN_STARTED;
      if (started) {
        return;
      }
      generate({
        domains: options.domains,
        pages: options.pages,
        languages: options.languages,
        defaultLanguage: options.defaultLanguage,
        getLanguagePath: options.getLanguagePath,
        filename: (d) => {
          if (options.domains.length > 1) {
            return path.resolve(root, `${d}.sitemap.xml`);
          }
          return path.resolve(root, `sitemap.xml`);
        }
      });
      process.env.LUBAN_SITEMAP_PLUGIN_STARTED = 'true';
    },
    buildEnd: () => {
      stop?.();
    }
  };
};

export default sitemapPlugin;
