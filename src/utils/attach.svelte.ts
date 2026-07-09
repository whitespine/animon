import { resolveDotpath } from "./paths";
import { stop } from "./handlers";
import { TextareaAutosize } from "runed";
import type { SystemActor } from "../documents/actor.svelte";
import type { SystemItem } from "../documents/item.svelte";

interface ArbitraryListeners<T extends HTMLElement> {
    on?: (elt: T) => any,
    off?: (elt: T) => any
    listeners?: {
        [key: string]: (evt: Event) => any
    }
}

/** Creates an @attach suitable function
 * For each listener in the provided hash (where keys are events),
 * automatically registers and deregisters that listener.
 * 
 * Special rules:
 * - "on" on mount called with the element as the arg
 * - "off" on unmount called with the element as the arg
 * 
 * @param  listeners 
 * @returns 
 */
export function buildListenerAttacher<T extends HTMLElement>(listeners: ArbitraryListeners<T>) {
    return (elt: T) => {
        const buildUp = () => {
            if(listeners.on) {
                listeners.on(elt);
            }
            for (let [k, v] of Object.entries(listeners.listeners ?? {})) {
                elt.addEventListener(k, v as any);
            }
        };

        const tearDown = () => {
            if(listeners.off) {
                listeners.off(elt);
            }
            for (let [k, v] of Object.entries(listeners.listeners ?? {})) {
                elt.removeEventListener(k, v as any);
            }
        };

        buildUp();
        return tearDown;
    }
}

export function portalTo(to: HTMLElement) {
    return (elt: HTMLElement) => {
        to.appendChild(elt);
        return () => {
            elt.remove();
        }
    }
}

export function scrambler(delay: number, generator: (index: number) => string) {
    return (elt: HTMLElement) => {
        let i = 0;
        let base = elt.innerHTML;
        let interval = setInterval(() => {
            elt.innerHTML = generator(i);
        }, delay);

        return () => {
            clearInterval(interval);
            elt.innerHTML = base;
        }
    }
}

export function rollScrambler(delay: number, max: number) {
    let min = 0;
    let gen = () => (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    return scrambler(delay, gen);
}

export function reactive<T extends string | number = string>(doc: SystemActor | SystemItem | ActiveEffect, path: string, preprocesser?: (v: T) => T) {
    function commit(evt: Event, delay: number) {
        stop(evt);
        let elt = evt.target;
        let new_value = (elt as any)?.value;
        if (new_value == undefined) return;
        let persisted_value = resolveDotpath(doc, path);
        // Preprocess value if necessary
        if (preprocesser) {
            new_value = preprocesser(new_value);
        }

        // Clear existing timeouts
        let act = (elt as any)._animon_change_timeout;
        if (act) {
            clearTimeout(act);
            (elt as any)._animon_change_timeout = undefined;
        }

        // Create our timeout callback
        let update = () => {
            if (persisted_value != new_value) {
                doc.update({
                    [path]: new_value,
                });
            }
        };

        // Set or immediately invoke timeout
        if (delay > 0) {
            (elt as any)._animon_change_timeout = setTimeout(update, delay);
        } else {
            update();
        }
    }

    return buildListenerAttacher<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>({
        on: (elt) => {
            $effect(() => {
                elt.name = path;
            });
            $effect(() => {
                // Only allow desync if not focused
                if (!(elt.matches(':focus') && (elt as any)._animon_change_timeout)) {
                    elt.value = resolveDotpath(doc, path);
                }
            });
        },
        listeners: {
            change: (evt) => commit(evt, 0),
            input: (evt) => commit(evt, 1000),
            focusout: (evt) => commit(evt, 0)
        }
    });
}

export function resizing(input_getter: () => string) {
    return (elt: HTMLTextAreaElement) => {
        new TextareaAutosize({
            element: () => elt,
            input: input_getter
        });
    }
}