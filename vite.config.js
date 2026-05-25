import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';


export default defineConfig({
  base: "/systems/animon/",
  root: "src/",
  publicDir: "../public",
  resolve: {
    alias: {
      $assets: resolve('public/assets'),
    }
  },
  server: {
    port: 20001,
    open: "/",
    proxy: {
      "^(?!/systems/animon)": "http://localhost:30000",
      "/socket.io": {
        target: "ws://localhost:30000",
        ws: true,
      },
    }
  },
  esbuild: { keepNames: true },
  build: {
    outDir: "../dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: "system",
      entry: "system.mjs",
      formats: ["es"],
      fileName: "system"
    }
  },
  plugins: [
    fixSystemJson(),
    svelte()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['color-functions', 'global-builtin', 'import']
      }
    }
  }
});

// Handles not release versions
function fixSystemJson() {
  return {
    name: 'fix-system-json',

    buildEnd(options) {
      const fs = require('fs');
      fs.mkdirSync("dist", { recursive: true })
      let system_json = fs.readFileSync("./system.json", { encoding: 'utf8', flag: 'r' });
      // This only matters if we're not in the ci pipeline
      system_json = system_json.replace("#{VERSION}#", "0.0.0");
      fs.writeFileSync("./dist/system.json", system_json);
    }
  }
}