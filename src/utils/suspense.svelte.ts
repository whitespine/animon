import { ANIMON } from "../consts";
import { sleep } from "./time";
import { SvelteSet } from "svelte/reactivity";
import { sendSocket } from "./socket.svelte";
/**
 * This serves as a mechanic for waiting (synchronized across clients) for a roll to finish.
 * Works with and without Dice-so-nice
 */

/**
 * Add a bit of suspense to your roll. This will either resolve via dice-so-nice, if enabled, or
 * if the settings have a configured dice delay use that as a timer instead.
 * If no delay is set, will resolve "immediately" via whatever your configured foundry roll mechanisms are.
 * 
 * Suspense state is tracked via the suspenseStatus function
 */
export function suspense(roll: Roll<any>): string {
    // Moves the result up or down by one
    let id = foundry.utils.randomID();
    if (!roll.result) throw new TypeError("Roll must be rolled before you suspense it");

    suspenseSet.add(id);

    // Handle locally
    wait(roll, game.user).then(() => suspenseSet.delete(id));
    // Tell everyone else to handle it

    let payload = {
        id,
        user_id: game.user._id,
        roll_json: roll.toJSON()
    };
    sendSocket(ANIMON.socket.suspense, payload);

    return id;
}

export interface SuspenseBroadcast {
    id: string,
    user_id: string,
    roll_json: any
}


/**
 * Wait for a roll to resolve via suspense settings
 * @param {Roll} roll 
 */
async function wait(roll: Roll<any>, user: User) {
    if ((game as any).dice3d) {
        await (game as any).dice3d.showForRoll(roll, user, false);
    } else {
        await sleep(1000);
    }
}

/**
 * Handle incoming suspense events
 */
export function onReceiveSuspense(payload: SuspenseBroadcast) {
    // Hydrate roll and dsn it
    let { roll_json, user_id, id } = payload;
    suspenseSet.add(id);
    let roll = Roll.fromData(roll_json);
    let user = game.users.get(user_id) ?? game.user;
    wait(roll, user).then(() => suspenseSet.delete(id));
}

// Our current things in suspense. If this .has something, its rolling! Hide results as appropriate
const suspenseSet = new SvelteSet<string>();

/**
 * 
 * @param {string} id The suspense id
 * @returns {boolean} True iff in suspense
 */
export function inSuspense(id: string) {
    return suspenseSet.has(id);
}


// disable automatic dice so nice messages for test and console rolls - we want to trigger them via suspense mechanism
// @ts-expect-error
Hooks.on("diceSoNiceMessagePreProcess", (message_id: string, obj: {willTrigger3DRoll: boolean}) => {
    let message = game.messages.get(message_id);
    if(message && ["basic_test", "contested_test"].includes(message.type)) {
        obj.willTrigger3DRoll = false;
    }
});