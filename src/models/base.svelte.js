// Establish a shorthand
export const fields = foundry.data.fields;

/**  
 * Operates similar to an ArrayField, but additionally
 * Handles an additional "length" option, and mandates that it remain at that length
 * If "overflow" option = truthy, then just forces there to be AT LEAST length
 */
export class ControlledLengthArrayField extends fields.ArrayField {
  // Constructor demands options
  constructor(element, options) {
    super(element, options);
    if (!Number.isInteger(options.length)) {
      throw new TypeError("ControlledLengthArrayField requires an integer 'length' option!");
    }
  }

  _cast(value) {
    value = super._cast(value);
    if (!Array.isArray(value)) {
      return value;
    } // Give up early

    // Extend or contract as appropriate
    while (value.length < this.options.length) {
      let new_elt = typeof this.element.initial == "function" ? this.element.initial() : this.element.initial;
      value.push(foundry.utils.duplicate(new_elt));
    }
    if (!this.options.overflow && value.length > this.options.length) {
      value = value.slice(0, this.options.length);
    }
    return value;
  }
}

// For sorts
export class SortField extends fields.NumberField {
  constructor() {
    super({initial: 0, integer: true});
  }
}

/**
 * Calls options.cast on every value provided to this. 
 * Options.cast should be idempotent.
 */
export class CastingStringField extends fields.StringField {
  _cast(value) {
    value = super._cast(value);
    if (typeof this.options.cast === "function") {
      value = this.options.cast(value);
    }
    return value;
  }
}

/**
 * Capitalizes the first letter of each word in the provided string
 * 
 * @param {string} text Base text
 *
 * @returns text as title case
 */
export function titleCaseString(text) {
  return text
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

/** Turns a sorted typed object field into a conventional array.
 * Each element has "_id" added as a key representing their original key
 * 
 * @param {Record<{sort: number}, any} tof The typed object field to sort. Assumes every element has a numeric "sort" key
 * @param {(object) => Array<number>} sort The typed object field to sort. Assumes every element has a numeric "sort" key
 */
export function sortedObjectToArray(tof, ranker=null) {
  let as_array = Object.entries(tof).map(([k, v]) => ({
    _id: k,
    ...v
  }));
  ranker ??= (x) => [x.sort, x._id]; // Default ranker stably sorts by sort, then by id. This can be overridden!
  return rankedSort(as_array, ranker);
}

/** Useful for sorting things with successive tiebreakers
 * 
 * @param {Array<T>} array The array to be sorted
 * @param {(T) => Array<string | number>} ranker Converts a given array item into an array of comparable items
 * @returns 
 */
export function rankedSort(array, ranker) {
  // Compute ranker for all elements
  let ir = array.map(x => [x, ranker(x)]);

  // Perform a sort
  ir.sort(([a, a_rank], [b, b_rank]) => {
    for(let i=0; i<a_rank.length && i<b_rank.length; i++) {
      if(typeof a_rank[i] == "string") {
        let c = a_rank[i].localeCompare(b_rank[i]);
        if(c) return c;
      } else if(typeof a_rank[i] == "number") {
        let c = a_rank[i] - b_rank[i];
        if(c) return c;
      } else {
        throw new TypeError("Unsupported type");
      }
    }
    // Overflow case - pick whichever is shorter
    return ar.length - br.length;
  });

  // Map back and return
  return ir.map(x => x[0]);
}

/** 
 * Turns a conventional array into a sorted typed object field 
 * Each element uses its embedded "_id" field to map to a key in a typed object field.
 * We assume that the order the array is sorted is in fact how you want it.
 * ids are preserved
 * 
 * @param {Array<{_id: string, sort: number}>} saf The sorted array to turn into a typed object field
*/
export function sortedArrayToObject(saf) {
  let as_object = {};
  let index = 0;
  for(let val of saf) {
    val.sort = 100*index;
    as_object[val._id] = val;
  }
  return as_object;
}