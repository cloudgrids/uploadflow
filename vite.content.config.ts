import { resolve } from 'path';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Chrome loads manifest content scripts as classic scripts, not ES modules.
// Build this entry separately as one self-contained IIFE to prevent Rollup from
// emitting shared-chunk imports that the browser cannot parse in that context.
export default defineConfig({
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
  publicDir: false,
  // Some React dependencies retain Node-style environment checks in an IIFE
  // library build. Content scripts have no global `process`, so replace the
  // expression during bundling instead of adding a browser polyfill.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/content/index.tsx'),
      formats: ['iife'],
      name: 'UploadFlowContent',
      fileName: () => 'content.js'
    }
  }
});
