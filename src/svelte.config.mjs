import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { cssModules } from 'svelte-preprocess-cssmodules';

export default {
  // Svelte options
  extensions: ['.svelte'],
  compilerOptions: {},
  preprocess: [ vitePreprocess(), cssModules()],
  onwarn: (warning, handler) => {
    if (warning.code.includes("a11y")) return;
    handler(warning)
  },
  // plugin options
  vitePlugin: {
    exclude: [],
    // experimental options
    experimental: {}
  }
};