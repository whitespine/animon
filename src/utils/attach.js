

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
            for(let [k, v] of Object.entries(listeners)) {
                if(k == "on") {
                    v(elt);
                } else {
                    elt.addEventListener(k, v);
                }
            }
        };

        const tearDown = () => {
            for(let [k, v] of Object.entries(listeners)) {
                if(k == "off") {
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