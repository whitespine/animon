import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";

export class GenericComponentApp extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["MY_SYSTEM_ID"],
    }

    constructor(component, props, options = {}) {
        options.svelte ??= {};
        options.svelte.component = component;
        options.svelte.props = props;
        super(options);
    }
}