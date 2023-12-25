import * as path from 'node:path';
import { loadEnv as viteLoadEnv } from 'vite';

export function loadEnv(args: { root: string; mode: string }) {
  const envDir = path.resolve(args.root, './envs');
  const envPrefix = ['VITE_', 'NODE_', '__VUE_', '__INTLIFY_'];
  const env = viteLoadEnv(args.mode, envDir, envPrefix);

  const keys = Object.keys(env);
  const define: Record<string, string> = {};
  keys.forEach((key) => {
    if (key.startsWith('__VUE_') || key.startsWith('__INTLIFY_')) {
      define[key] = JSON.stringify(env[key]);
      return;
    }
    define[`process.env.${key}`] = JSON.stringify(env[key]);
  });

  return { envDir, envPrefix, env, define };
}
