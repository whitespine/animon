import type { Speaker } from "../components/rolls/prompt/roller_state.svelte";
import type { BasicTestParams } from "../models/messages/basic_test";
import type { BaseData, ContestedTestModel, ContestedTestParams } from "../models/messages/contested_test";
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


export async function rollBasicTest(check_details: BasicTestParams, speaker?: Speaker) {
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
}

export async function startContestedTest(check_details: ContestedTestParams, speaker: Speaker, opponents: Actor[]) {
    let formula = boostedFormula(check_details.dice_pool, check_details.boost);
    let roll = await new Roll(formula).roll();

    let actor = ChatMessage.getSpeakerActor(speaker);
    if (!actor) {
        ui.notifications.error("Cannot start a contested check without an actor controlled.")
        return;
    }
    let contestants: BaseData["contestants"] = {};
    let sort = 0;
    for (let participant of [actor, ...opponents]) {
        if (!participant.uuid) continue;
        contestants[participant.uuid] = {
            params: check_details,
            alias: participant.name,
            suspense: participant == actor ? suspense(roll) : null,
            sort: sort++,
            pushed: false,
            roll: participant == actor ? JSON.stringify(roll.toJSON()) : null
        }
    }

    // Send to chat immediately. 
    await ChatMessage.create({
        type: "contested_test",
        rolls: [],
        speaker: speaker,
        system: {
            contestants
        }
    });
}