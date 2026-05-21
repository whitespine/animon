
/**
 * Utility functions for testing and filtering foundry document ownership
 */


/** Returns a list of _online_ users who have at least the given level of ownership of a document
 * @param {FoundryDocument} document 
 * @param {number} level Ownership level
 * @returns {User[]} An Array of users
 */
export function onlineOwners(document, level = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
    return owners(document, level).filter(u => u.active);
}

// Returns a list of users who have at least the given level of ownership of a document
/**
 * 
 * @param {FoundryDocument} document 
 * @param {level} level Minimum ownership level
 * @returns 
 */
export function owners(document, level = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
    let ownership = document.ownership ?? { default: 0 };
    let result = [];
    for (let user of game.users.contents) {
        if (user.isGM || ((ownership[user.id] ?? ownership["default"] ?? 0) >= level)) {
            result.push(user);
        }
    }
    return result;
}