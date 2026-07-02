import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { sveltePreprocess } from "svelte-preprocess";
import foundryvtt from "vite-plugin-foundryvtt";
import checker from "vite-plugin-checker";

import systemJson from "./system.json";

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
  build: {
    outDir: "../dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: "system",
      entry: "system.ts",
      formats: ["es"],
      fileName: "system"
    },
    rolldownOptions: { output: { keepNames: true } },
  },
  plugins: [
    fixSystemJson(),
    checker({ typescript: true, enableBuild: false }),
    svelte({ preprocess: sveltePreprocess() }),
    foundryvtt(systemJson),
    // svelte()
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

    buildEnd(options: any) {
      const fs = require('fs');
      fs.mkdirSync("dist", { recursive: true })
      let system_json = fs.readFileSync("./system.json", { encoding: 'utf8', flag: 'r' });
      // This only matters if we're not in the ci pipeline
      system_json = system_json.replace("#{VERSION}#", "0.0.0");
      fs.writeFileSync("./dist/system.json", system_json);
    }
  }
}