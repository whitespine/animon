/**
 * Inject reactivity into various core document fields.
 * This is the heart of quicksilver
 * 
 * To explain what happens here, for each `target` class targeted in CORE_INJECTS,
 * we monkeypatch the `_configure` method (the purpose of which is irrelevant, its just good timing for when to do this)
 * to add a new getter/setter guarding each of the `keys`. This getter/setter essentially guards the access of
 * a spontaneously generated svelte state, nested within the `Statelet` class. In so doing, we dynamically add
 * svelte reactivity to any foundry document at runtime
 * 
 * Further, we use `injectEmbeddedCollectionsReactivity` to monkey patch the `initialize` method,
 * generating a new `svelte` property on any embedded collection that is a SvelteMap,
 * which reflects the internal state of the EmbeddedCollection as a Map (not necessarily reflecting the order of the app).
 * 
 * This way, any time the embedded collection is updated, we either do a first time initialization or a minimal update
 * of this SvelteMap, and likewise make any observation of this collection reactive.
 * This reactivity is not deep - CORE_INJECTS is necessary so the documents themselves are reactive
 */

import { SvelteMap } from "svelte/reactivity";

// Simple wrapper around a single svelte state
class Statelet {
    constructor(initial) {
        this.value = $state(initial);
    }
}

// Add getters and setters for a statelet
function stateletKey(key) {
    return `_STATELET__${key}`;
}

// Get a statelet, or initialize+grab it if not yet assigned
function safeGetStatelet(object, sk, initial_value) {
    if (!(sk in object)) {
        object[sk] = new Statelet(initial_value);
    }
    return object[sk];
}

// Call during a _configure to inject a Statelet and appropriate getters and setters, to make any field reactive
// initial_value does not really matter
export function injectReactive(object, key, hidden_key=null) {
    let sk = hidden_key ?? stateletKey(key);
    Object.defineProperty(object, key, {
        get: function () { return safeGetStatelet(object, sk, null).value },
        set: function (v) { safeGetStatelet(object, sk, null).value = v }
    });
}

// A setup of global injects
const CORE_INJECTS = [
    {
        target: User,
        keys: ["name"] // Color doesn't quite work because it is an extension of a subclass of Number. Confusing
    }, {
        target: Actor,
        keys: ["name", "img", "system"]
    }, {
        target: Item,
        keys: ["name", "img", "system"]
    }, {
        target: Combat,
        keys: ["system"]
    }, {
        target: Roll,
        keys: ["rolls"] // TODO more
    }, {
        target: Combatant,
        keys: ["name", "img", "system"]
    }, {
        target: ChatMessage,
        keys: ["rolls", "flags"]
    }
];

// Hijacks the configure function on a predefined set of core documents to be reactive
export function injectAllCoreDocumentsReactivity() {
    for (let inject of CORE_INJECTS) {
        const original_configure = inject.target.prototype._configure;
        inject.target.prototype._configure = function (options = {}) {
            const original_this = this;
            original_configure.call(original_this, options);

            // Then do injects
            for (let key of inject.keys) {
                injectReactive(original_this, key);
            }
        }
    }
}

// Monkeypatches EmbeddedCollection to have and maintain a `.svelte` map of instantiated documents
export function injectEmbeddedCollectionsReactivity() {
    const origInitialize = foundry.abstract.EmbeddedCollection.prototype.initialize;
    foundry.abstract.EmbeddedCollection.prototype.initialize = function (options = {}) {
        const original_this = this;
        origInitialize.call(original_this, options);

        // Setup reactive map if we haven't
        if(!("svelte" in this)) { this.svelte = new SvelteMap(); }

        // Get all records we have initialized
        const initializedIds = new Set();
        for (const [id, doc] of this.entries()) {
            if (doc) initializedIds.add(id);
        }

        // Sync our internal svelte reactive map - first delete what was removed from "this"
        if (this.svelte.size !== initializedIds.size) {
            for (const k of this.svelte.keys()) {
                if (!initializedIds.has(k)) {
                    this.svelte.delete(k);
                }
            }
        }
        // Then add what is missing from this.svelte
        if (this.svelte.size !== initializedIds.size) {
            for (const k of initializedIds) {
                if (!this.svelte.has(k)) {
                    this.svelte.set(k, this.get(k));
                }
            }
        }
    }
}
