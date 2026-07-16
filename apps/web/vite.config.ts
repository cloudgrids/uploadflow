import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: 'uploadflow-test-upload',
      configureServer(server) {
        server.middlewares.use('/api/test-upload', (request, response) => {
          let receivedBytes = 0;
          request.on('data', (chunk: Buffer) => { receivedBytes += chunk.length; });
          request.on('end', () => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ success: true, receivedBytes }));
          });
        });
      }
    }
  ],
  server: { host: '127.0.0.1', port: 3000, strictPort: true, cors: true }
});
