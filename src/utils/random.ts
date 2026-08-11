

/**
 * 
 * @param min Minimum value. Integer, inclusive
 * @param max Maximum value. Integer, inclusive
 * @param avoid Number to skip if drawn. Integer
 * @returns A random integer between min and max, inclusive, excluding avoid
 */
export function randomNumber(min: number, max: number, avoid?: number) {
    if (avoid != undefined) {
        // Constrain our range momentarily
        max -= 1;
    }
    let gen = Math.floor(Math.random() * (max - min + 1)) + min;
    if (avoid != undefined && gen >= avoid) {
        // Ensure that it always avoids the avoid
        gen += 1;
    }
    return gen;
}