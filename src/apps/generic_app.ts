import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import type {Component} from "svelte";

class ConcreteV2 extends foundry.applications.api.ApplicationV2 {}

export class GenericComponentApp<T extends object> extends SvelteApplicationMixin<any, typeof foundry.applications.api.ApplicationV2>(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["animon"],
    }

    fixed_context: T;

    constructor(component: Component, context: T, options = {}) {
        // @ts-ignore
        options.svelte.component = component;
        super(options);
        this.fixed_context = context;
    }

    async _prepareContext() {
        return this.fixed_context;
    }
}