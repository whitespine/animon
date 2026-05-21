/**
 * Common event handlers for svelte
 */

// Function will be only called once
export function once(fn) {
    return function (event) {
        if (fn) fn.call(this, event);
        fn = null;
    };
}

// Stop events dead in their tracks
export function stop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return evt;
}

// Stop propagation only
export function stopProp(evt) {
    evt.stopPropagation();
    return evt;
}

// Prevent default only
export function prevent(evt) {
    evt.stopPropagation();
    return evt;
}