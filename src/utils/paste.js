
/**
 * This includes common utility functions for cleaning up text pasted from a pdf
 */


/** Aggressively prune whitespace and newlines in a string
 * 
 * @param {string} text text
 * @param {string} keep_newlines Whether to condence whitespace including a newline to just a newline
 * @returns {string} The trimmed string
 */
export function cleanup_whitespace(text, keep_newlines=false) {
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
export function get_double(text) {
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

/** Creates an UpdateInput update callback that will auto-populate the move name if 
 * it matches formats commonly seen within data pasted from the pdf
 * 
 * @param {Document} doc The document to update moves within
 * @param {string} path The path to the move object
 * @returns {(text: string) => Promise<void>} A callback to perform updates
 */
export function move_paste_handler(doc, path) {
    /** @type {(text: string) => Promise<void>} */
    return async (text) => {
        // Under normal circumstances, just update the move text as normal
        let name_path=`${path}.name`;
        let text_path=`${path}.text`;

        // Check for a leading string
        let lead = text.match(/.*?\./);
        let double_lead = `${lead[0]} ${lead[0]}`;
        if(lead && text.startsWith(double_lead)) {
            // Remove both, set name with it
            await doc.update({
                [name_path]: lead[0].replaceAll(".", "").trim(),
                [text_path]: text.replaceAll(double_lead, "")
            });
        } else {
            // Otherwise set normally
            await doc.update({
                [text_path]: text
            });
        }
    }
}

/** Creates an UpdateInput update callback that will auto-populate the move name if 
 * 
 * @param {Document} doc The document to update moves within
 * @param {string} path The path to the move object
 * @returns {(text: string) => Promise<void>} A callback to perform updates
 */
export function ability_paste_handler(doc, path) {
   // todo
}