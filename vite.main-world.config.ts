import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/main-world/index.ts'),
      formats: ['iife'],
      name: 'UploadFlowMainWorld',
      fileName: () => 'main-world.js'
    }
  }
});
