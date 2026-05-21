// Tricks svelte into depending on document mutability. Always returns the last value.
export function chain(...values) {
    return values[values.length - 1];
}