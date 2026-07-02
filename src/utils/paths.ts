
/**
 * Helper function to format a dotpath to not have any square brackets, instead using pure dot notation
 *
 * @param {string} path The path to format
 *
 * @returns {string} The same path, but with all square brackets replaced with dots
 */
export function formatDotpath(path: string): string {
  return path.replace(/\[/g, ".").replace(/]/g, "");
}

/**
 * An object providing context on the path and result relative to the most deploy nested document we encounter
 *
 * @typedef {object} PathResolutionStep 
 *
 * @property {string | null} pathlet The individual x, y, or z substrings of an x.y.z path
 *
 * @property {any} val The value reached at a specific x, y, or z of an x.y.z path
 */

/**
 * 
 * Helper function to get arbitrarily deep array references
 * Returns every item along the path, starting with the object itself
 * Any failed pathlet resolutions will still be emitted, but as an undefined
 * An empty string resolved in this way will simply return root.
 * 
 * @param {object} obj The object to drill down into
 *
 * @param {string} path The dotpath to use
 * 
 * @param {boolean} [warn_on_unresolved] Whether to warn if we can't resolve
 *
 * @returns {Array<PathResolutionStep>} An array of the steps we took resolving the path
 */
export function stepwiseResolveDotpath(obj: any, path: string, warn_on_unresolved=false) {
  const pathlets = formatDotpath(path).split(".");

  // Resolve each key, starting with root
  const result = [
    {
      pathlet: null as string | null, 
      val: obj
    },
  ];

  for (const pathlet of pathlets) {
    if(warn_on_unresolved && !Object.hasOwn(obj, pathlet)) {
      console.warn(`Failed to resolve path ${path} at pathlet ${pathlet}`, obj);
      warn_on_unresolved = false;
    }
    obj = obj?.[pathlet];
    result.push({
      pathlet,
      val: obj,
    });
  }
  return result;
}

/**
 * Helper function to get arbitrarily deep array references
 * Any failed resolutions will still be emitted, but as a dedicated symbol
 *
 * @param {object} obj The object to drill down into
 *
 * @param {string} path The dotpath to follow
 *
 * @param {any} [default_=undefined] The default value to return if the dotpath is not reached.
 *
 * @param {ResolveDotpathOptions} [opts] Additional arguments
 *
 * @returns {any} Value at end of path, or default value
 */
export function resolveDotpath(obj: any, path: string, default_ = undefined, opts?: {shorten_by?: number, warn_on_unresolved: boolean}) {
  const evaluated = stepwiseResolveDotpath(obj, path, opts?.warn_on_unresolved ?? true);
  let item;

  // Get the last item, or one even further back if shorten-by provided
  if (opts?.shorten_by) {
    item = evaluated[evaluated.length - 1 - opts.shorten_by];
  } else {
    item = evaluated[evaluated.length - 1];
  }
  return item.val === undefined ? default_ : item.val;
}

export const ERR_ON_UNRESOLVED = Symbol("ERR_ON_UNRESOLVED");