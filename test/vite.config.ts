import * as path from 'node:path';
import { defineConfig } from 'vite';
import viteLubanPlugin from '../dist';

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
