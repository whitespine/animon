/**
 * Common event handlers for svelte
 */

// Function will be only called once
export function once(fn: (evt: Event) => any) {
    let done = false;
    return function (event: Event) {
        if(!done) {
            fn(event);
        }
        done = true;
    };
}

// Stop events dead in their tracks
export function stop(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    return evt;
}

// Stop propagation only
export function stopProp(evt: Event) {
    evt.stopPropagation();
    return evt;
}

// Prevent default only
export function prevent(evt: Event) {
    evt.stopPropagation();
    return evt;
}