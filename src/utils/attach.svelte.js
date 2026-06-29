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
                    elt.removeEventListener(k, v);
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
            elt.remove();
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
    function commit(evt, delay) {
        stop(evt);
        let elt = evt.target;
        let new_value = elt.value;
        let persisted_value = resolveDotpath(doc, path);
        // Preprocess value if necessary
        if (preprocesser) {
            new_value = preprocesser(new_value);
        }
        elt.value = new_value;

        // Clear existing timeouts
        if (elt._animon_change_timeout) {
            clearTimeout(elt._animon_change_timeout);
            elt._animon_change_timeout = undefined;
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
            elt._animon_change_timeout = setTimeout(update, delay);
        } else {
            update();
        }
    }

    return buildListenerAttacher({
        on: (elt) => {
            $effect(() => {
                elt.name = path;
            });
            $effect(() => {
                // Only allow desync if not focused
                if(!(elt.matches(':focus') && elt._animon_change_timeout)) {
                    elt.value = resolveDotpath(doc, path);
                }
            });
        },
        change: (evt) => commit(evt, 0),
        input: (evt) => commit(evt, 1000),
        focusout: (evt) => commit(evt, 0)
    });
}