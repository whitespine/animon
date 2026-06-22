import { suspense } from "./suspense.svelte";
import { targetedTokens } from "./target.svelte";

/**
 * 
 * @param {number} boost The boost value, an integer between -2 and 2
 * @returns The value which you must roll >=
 */
export function boostedThreshold(boost) {
    return 4 - boost;
}

/**
 * 
 * @param {number} pool The dice pool, an integer
 * @param {number} boost The boost value, an integer between -2 and 2
 * @returns {string} a dice formula
 */
export function boostedFormula(pool, boost) {
    console.log(`${pool}d6cs>=${boostedThreshold(boost)}`);
    return `${pool}d6cs>=${boostedThreshold(boost)}`
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
    let formula = boostedFormula(check_details.dice_pool, check_details.boost);
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