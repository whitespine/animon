import { ANIMON } from "../consts";
import type { ContestChatMessage } from "../documents/message.svelte";
import type { BasicTestModel, BasicTestParams } from "../models/messages/basic_test";
import type { ContestedTestModel, ContestedTestParams } from "../models/messages/contested_test";
import { sendSocket } from "./socket.svelte";
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

export async function startContestedTest(check_details: ContestedTestParams, speaker: ReturnType<typeof ChatMessage.getSpeaker>, other_actors: Actor[]) {
    let formula = boostedFormula(check_details.dice_pool, check_details.boost);
    let roll = await new Roll(formula).roll();

    let actor = ChatMessage.getSpeakerActor(speaker);
    if(!actor) {
        ui.notifications.error("Cannot start a contested check without an actor controlled.")
        return;
    }

    // Send to chat immediately. 
    let message = await ChatMessage.create({
        type: "contested_test",
        rolls: [],
        speaker: speaker,
        system: {
            contestants: {
                [actor.uuid]: {
                    params: check_details,
                    alias: actor.name,
                    suspense: suspense(roll),
                    sort: 0,
                    roll: roll.toJSON()
                }
            }
        }
    });

    // Broadcast our need for others
    let broadcast: StartContestBroadcast = {
        message_id: message!.id,
        contestant_uuids: other_actors.map(x => x.uuid).filter(x => x) as string[],
    };
    await sendSocket(ANIMON.socket.contest, broadcast);

    return {
        message,
        roll // technically embedded in message
    };
}

export interface StartContestBroadcast {
    message_id: string, 
    contestant_uuids: string[]
}

export interface RespondContestBroadcast {
    alias: string,
    message_id: string, 
    contestant_uuid: string,
    roll_params: ContestedTestParams,
    roll_data: Roll.Data,
    suspense: string | null
}


// Someone responded to our contest. We update the message
export function onReceiveContestResponse(broadcast: RespondContestBroadcast) {
    // Before updating message, close all ux that is obviated by this roll. EX: if multiple owners own an actor, only one needs to respond
    // TODO
    let message = game.messages.get(broadcast.message_id);
    // Does the message exist as right type?
    if(!message || message.type != "contested_test") return;
    // Are we the author?
    if(!message.isOwner) return;

    // Update the appropriate whatever
    let contest = message as ContestChatMessage;
    let max_sort = Math.max(...Object.values(contest.system.contestants).map(c => c.sort));
    contest.update({
        system: {
            contestants: {
                [broadcast.contestant_uuid]: {
                    alias: broadcast.alias,
                    suspense: broadcast.suspense,
                    params: broadcast.roll_params,
                    pushed: false,
                    roll: broadcast.roll_data,
                    sort: max_sort + 100
                }
            }
        }
    });
}