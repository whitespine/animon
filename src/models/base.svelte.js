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
 */
export function sortedObjectToArray(tof) {
  let as_array = Object.entries(tof).map(([k, v]) => ({
    _id: k,
    ...v
  }));
  return as_array.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
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