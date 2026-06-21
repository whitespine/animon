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
    let message = await ChatMessage.create({
        type: "basic_check",
        rolls: [roll],
        speaker: speaker ?? ChatMessage.getSpeaker(),
        author: check_details.author,
        system: {
            params: check_details,
            suspense: suspense(roll)
        }
    });

    return {
        message,
        roll // technically embedded in message
    };
}