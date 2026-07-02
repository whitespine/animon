import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import type {Component} from "svelte";

export class GenericComponentApp extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["animon"],
    }

    constructor(component: Component, context, options = {}) {
        options.svelte ??= {};
        options.svelte.component = component;
        options.svelte.props = props;
        super(options);
    }
}