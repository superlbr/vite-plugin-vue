import * as path from 'node:path';
import { defineConfig } from 'vite';
import viteLubanPlugin from '../dist';

export default defineConfig(() => {
  const root = __dirname;

  return {
    root,
    server: {
      host: '0.0.0.0',
      port: 5174
    },

    plugins: [viteLubanPlugin({
      root,
      ssl: {
        enable: false
      },
      mkcert: {
        enable: true
      },
      sitemap: {
        enable: true,
        options: {
          domains: ['www.luban-ui.dev'],
          languages: ['zh-CN', 'en-US'],
          defaultLanguage: 'zh-CN',
          pages: [
            {
              path: '/'
            }
          ]
        }
      }
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
