import type { BasicTestModel, BasicTestParams } from "../models/messages/basic_test";
import { suspense } from "./suspense.svelte";

/**
 * 
 * @param boost The boost value, an integer between -2 and 2
 * @returns The value which you must roll >=
 */
export function boostedThreshold(boost: number): number {
    return 4 - boost;
}

/**
 * 
 * @param pool The dice pool, an integer
 * @param boost The boost value, an integer between -2 and 2
 * @returns a dice formula
 */
export function boostedFormula(pool: number, boost: number): string {
    return `${pool}d6cs>=${boostedThreshold(boost)}`
}

/**
 * A useful aggregate type for our from/to callbacks
 * @typedef {object} BasicTestParams
 * @property {number} dice_pool How many dice we're rolling
 * @property {number} boost [-2, 2] How we're computing boost
 * @property {number} difficulty Difficulty
 * @property {number} bond_points_spent For bookkeeping, how much was spent on this roll
 */


export async function rollBasicTest(check_details: BasicTestParams, speaker?: ReturnType<typeof ChatMessage.getSpeaker>) {
    let formula = boostedFormula(check_details.dice_pool, check_details.boost);
    let roll = await new Roll(formula).roll();

    // Send to chat immediately. 
    let message = await ChatMessage.create({
        type: "basic_test",
        rolls: [roll],
        speaker: speaker ?? ChatMessage.getSpeaker(),
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