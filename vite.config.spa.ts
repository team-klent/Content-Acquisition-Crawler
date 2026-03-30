import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

/**
 * Vite config for building Content Acquisition Crawler as
 * single-spa micro-frontend bundles (ESM).
 *
 * Produces two entry points:
 *   - dist-spa/ca-entry.js    (Content Acquisition)
 *   - dist-spa/inventory-entry.js  (Inventory)
 *
 * React and ReactDOM are externalised — the host provides them
 * via an import map at runtime.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Inject bundle metadata as compile-time constants.
  // Also replace process.env.* used by @tanstack/table-core and components —
  // `process` does not exist in the browser and would throw at runtime.
  define: {
    __MFE_VERSION__: JSON.stringify(pkg.version),
    __MFE_NAME__: JSON.stringify(pkg.name),
    __MFE_BUILD_TIME__: JSON.stringify(new Date().toISOString()),

    // Node.js globals required by bundled libraries (@tanstack, etc.)
    'process.env.NODE_ENV': JSON.stringify('production'),

    // Next.js public env vars used in pdf-confirmation-button.tsx as fallbacks.
    // In the MFE context these values come from host props — fallback to ''.
    'process.env.NEXT_PUBLIC_PROJECT_CODE': JSON.stringify(''),
    'process.env.NEXT_PUBLIC_WORKFLOW_CODE': JSON.stringify(''),
    'process.env.NEXT_PUBLIC_FIRST_TASK_UID': JSON.stringify(''),
  },

  // Override the project's postcss.config.mjs (which uses @tailwindcss/postcss
  // meant for Next.js). Tailwind is handled by the @tailwindcss/vite plugin instead.
  css: {
    postcss: { plugins: [] },
  },

  resolve: {
    alias: {
      // Mirror the @/* path alias from tsconfig
      '@/': `${path.resolve(__dirname)}/`,

      // Replace Next.js modules with SPA-compatible shims
      'next/navigation': path.resolve(
        __dirname,
        'spa/shims/next-navigation.tsx'
      ),
      'next/image': path.resolve(__dirname, 'spa/shims/next-image.tsx'),
    },
  },

  build: {
    outDir: 'dist-spa',
    emptyOutDir: true,
    sourcemap: true,

    lib: {
      entry: {
        'ca-entry': path.resolve(__dirname, 'spa/ca-entry.tsx'),
        'inventory-entry': path.resolve(__dirname, 'spa/inventory-entry.tsx'),
      },
      formats: ['es'],
    },

    rollupOptions: {
      // Externalise React — the host provides shared copies via import map
      external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
      output: {
        // Predictable filenames (no hash) for import map references
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        globals: {
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOMClient',
        },
      },
    },

    // Inline CSS into the JS bundle so the host only needs to load one file per MFE.
    // If you prefer a separate .css file, set this to false.
    cssCodeSplit: false,
  },

  // Dev server — host expects http://localhost:8081/ca-entry.js
  // In dev mode, Vite serves source files; for built bundles use `npx serve dist-spa`
  server: {
    port: 8081,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  // Preview server — serves the built dist-spa/ output
  preview: {
    port: 8081,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
