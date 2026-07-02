
/**
 * This includes common utility functions for cleaning up text pasted from a pdf
 */


/** Aggressively prune whitespace and newlines in a string
 * 
 * @param {string} text text
 * @param {string} keep_newlines Whether to condence whitespace including a newline to just a newline
 * @returns {string} The trimmed string
 */
export function cleanup_whitespace(text: string, keep_newlines=false) {
    return text.trim().replaceAll(/\s+/g, (x) => {
        if(keep_newlines && x.includes("\n")) return "\n";
        return " ";
    });
}

/**  Looks for doubled text that is the frequent artifact of pdf copy pasting
 * 
 * @param {string} text 
 * @returns {{double: string | null, rest: string }}
 */
export function get_double(text: string) {
    const pattern = /\s*(\S.+\S)\s*\1\s*(\S[\s\S]*)/m;
    // Check for a leading string
    let match = text.match(pattern);
    if(!match) {
        return {
            double: null,
            rest: text
        }
    } else {
        let [_, double, rest] = match;
        return {
            double, rest
        };
    }
}