import { resolveDotpath } from "./paths";
import {stop} from "./handlers";

/** Creates an @attach suitable function
 * For each listener in the provided hash (where keys are events),
 * automatically registers and deregisters that listener.
 * 
 * Special rules:
 * - "on" on mount called with the element as the arg
 * - "off" on unmount called with the element as the arg
 * 
 * @param {Record<string, any>} listeners 
 * @returns {(elt: HTMLElement) => void}
 */
export function buildListenerAttacher(listeners) {
    return (elt) => {
        const buildUp = () => {
            for (let [k, v] of Object.entries(listeners)) {
                if (k == "on") {
                    v(elt);
                } else {
                    elt.addEventListener(k, v);
                }
            }
        };

        const tearDown = () => {
            for (let [k, v] of Object.entries(listeners)) {
                if (k == "off") {
                    v(elt);
                } else {
                    elt.addEventListener(k, v);
                }
            }
        };

        buildUp();
        return tearDown;
    }
}

export function portalTo(to) {
    return (elt) => {
        to.appendChild(elt);
        return () => {
            to.removeChild(elt);
        }
    }
}

export function scrambler(delay, generator) {
    return (elt) => {
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

export function rollScrambler(delay, max) {
    let min = 0;
    let gen = () => Math.floor(Math.random() * (max - min + 1)) + min;
    return scrambler(delay, gen);
}

export function reactive(doc, path, preprocesser = null) {
    // let persisted_value = resolveDotpath(doc, path); // Initiall unset
    let elt = null;
    let persisted_value = $derived(resolveDotpath(doc, path)); // = resolveDotpath(doc, path); // Initiall unset
    $effect(() => {
        // Only allow desync if not focused
        if(elt && !elt.matches(':focus')) {
            elt.value = persisted_value;
        }
    });

    let change_timeout = null;
    function commit(new_value, delay) {
        // Preprocess value if necessary
        if (preprocesser) {
            new_value = preprocesser(new_value);
        }
        elt.value = new_value;

        // Clear existing timeouts
        if (change_timeout) {
            clearTimeout(change_timeout);
            change_timeout = null;
        }

        // Create our timeout callback
        let update = () => {
            if(persisted_value != new_value) {
                doc.update({
                    [path]: new_value,
                });
            }
        };

        // Set or immediately invoke timeout
        if (delay > 0) {
            change_timeout = setTimeout(update, delay);
        } else {
            update();
        }
    }

    return buildListenerAttacher({
        on: (e) => {
            if(elt) {
                if(e == elt) {
                    return; 
                }
                console.error("reactive is not meant to be reusable. Old, new", elt, e);
                return;
            }
            elt = e;
            elt.name ??= path;
            elt.value = persisted_value;
        },
        change: (e) => commit(stop(e).target.value, 0),
        input: (e) => commit(stop(e).target.value, 1000),
        focusout: (e) => {
            stop(e);
            commit(stop(e).target.value, 0);
        }
    });
}