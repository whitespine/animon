import { suspense } from "./suspense.svelte";
import { targetedTokens } from "./target.svelte";

/** An attempt at a skill or other basic check check. Customize to suite your system - all the parameters of a roll should be contained herein
 * @typedef {object} CheckParams
 * @property {"standard" | "disadvantage" | "advantage"} mode The mode for the roll
 * @property {number} difficulty The difficulty of the roll
 * @property {number} bonus The bonus to the roll
 * @property {string} [author] The author to override. 
 */

/** Produce a formula for a roll with a given bonus. Customize this to suite your system
 * 
 * @param {CheckParams} params The roll params
 */
export function formulaFor(params) {
    if(params.mode == "advantage") {
        return `2d6k1 + ${params.bonus}`;
    } else if(params.mode == "disadvantage") {
        return `2d6kl1 + ${params.bonus}`;
    } else {
        return `1d6 + ${params.bonus}`;
    }
}

/**
 * 
 * @param {CheckParams} check_details 
 * @param {Actor} speaker Possible other speaker to use 
 * @returns {Promise<{
 *   message: ChatMessage,
 *   roll: Roll
 * }>}
 */
export async function rollCheck(check_details, speaker=null) {
    let formula = formulaFor(check_details);
    let roll = await new Roll(formula).roll();

    // Send to chat immediately. 
    /**
     * @type {CheckMessageData}
     */
    let flags = {
        type: "roll_check",
        params: check_details,
        pushed: false,
        suspense: suspense(roll)
    };
    let message = await ChatMessage.create({
        rolls: [roll],
        speaker: speaker ?? ChatMessage.getSpeaker(),
        author: check_details.author,
        // Doomsong specific sauce
        [`flags.${game.system.id}`]: flags
    });

    return {
        message,
        roll // technically embedded in message
    };
}


/** Our union type for all custom messages
 * @typedef {ShowGearMessageData | CheckMessageData} SystemMessageData
 */

/** Our type for specifically a generic roll "check" message. 
 * You might be wondering, "no Roll property?" - by default, chat messages actually store a roll!
 * But you can definitely store more in here if you want
 * @typedef {object} CheckMessageData
 * @property {"roll_check"} type The text to show for the consequence
 * @property {CheckParams} params The params the check was instantiated with. Some of these are redundant, but its simple!
 * @property {boolean} pushed Whether you've rerolled this roll. Good example of mutating an existing message!
 * @property {string} [suspense] ID of the roll suspense (see suspense.svelte.js). Might be null
 */

/** Our type for specifically message to show off an item in chat
 * @typedef {object} ShowGearMessageData
 * @property {"show_gear"} type The text to show for the consequence
 * @property {string} item uuid of the item
 */
