

/*
* like in python
*/

// https://stackoverflow.com/questions/22015684/zip-arrays-in-javascript
// Zips arrays together. Mismatch => undefined
export function zip(...arr) {
    return Array(Math.max(...arr.map(a => a.length))).fill().map((_,i) => arr.map(a => a[i]));  
}