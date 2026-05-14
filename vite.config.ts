import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backend = env.BACKEND_URL ?? 'https://voxii-tutor-backend-919882895306.australia-southeast1.run.app';
  const fallbackSecret = env.API_SECRET ?? '';

  // Proxy config: forward the browser's JWT when present.
  // Falls back to API_SECRET bearer token so local dev without Supabase still works.
  function makeProxy(target: string) {
    return {
      target: backend,
      changeOrigin: true,
      rewrite: () => target,
      configure: (proxy: any) => {
        proxy.on('proxyReq', (proxyReq: any, req: any) => {
          const incoming = req.headers?.authorization;
          if (incoming) {
            proxyReq.setHeader('Authorization', incoming);
          } else if (fallbackSecret) {
            proxyReq.setHeader('Authorization', `Bearer ${fallbackSecret}`);
          }
        });
      },
    };
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/chat':   makeProxy('/chat'),
        '/api/intake': makeProxy('/intake'),
        '/api/tts':    makeProxy('/tts'),
      },
    },
  };
});
