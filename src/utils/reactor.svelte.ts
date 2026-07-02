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
 * 
 * Note!!! when we patch `system`, you might be wondering if this is actualy applying any deep reactivity to our data models.
 * The answer is no - data models are re-generated any time the underlying _source is changed.
 * Therefore, $state and $derived don't _generally_ serve any purpose in these models,
 * however, in some cases you might wish to have a $state on a model that is NOT derived from source, 
 * and that can be manipulated via other events (such as sockets, etcetera)
 */

import { SvelteMap } from "svelte/reactivity";

// Simple wrapper around a single svelte state
class Statelet<T> {
    value: T;
    constructor(initial: T) {
        this.value = $state(initial);
    }
}

// Add getters and setters for a statelet
function stateletKey(key: string) {
    return `_STATELET__${key}`;
}

// Get a statelet, or initialize+grab it if not yet assigned
function safeGetStatelet<T>(object: any, sk: string, initial_value: T) {
    if (!(sk in object)) {
        object[sk] = new Statelet(initial_value);
    }
    return object[sk];
}

// Call during a _configure to inject a Statelet and appropriate getters and setters, to make any field reactive
// initial_value does not really matter
export function injectReactive(object: any, key: string, hidden_key?: string) {
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
        target: ActiveEffect,
        keys: ["name", "img", "system"]
    }, {
        target: Combat,
        keys: ["system"]
    }, {
        target: Combatant,
        keys: ["name", "img", "system"]
    }, {
        target: ChatMessage,
        keys: ["rolls", "flags", "system"]
    }
];

// Hijacks the configure function on a predefined set of core documents to be reactive
export function injectAllCoreDocumentsReactivity() {
    for (let inject of CORE_INJECTS) {
        //@ts-ignore
        const original_configure = inject.target.prototype._configure;
        //@ts-ignore
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

// Augment embedded collection to have the right
declare global {
    namespace foundry.abstract {
        interface EmbeddedCollection<
            out ContainedDocument extends foundry.abstract.Document.Any,
            out ParentDocument extends foundry.abstract.Document.Any,
            out Methods extends Collection.Methods.Any> { // = foundry.abstract.EmbeddedCollection.Methods<ContainedDocument>>
            svelte: SvelteMap<string, ContainedDocument>
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
        if (!("svelte" in this)) { (this as foundry.abstract.EmbeddedCollection<any, any, any>).svelte = new SvelteMap(); }

        // Get all records we have initialized
        const initializedIds = new Set<string>();
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
