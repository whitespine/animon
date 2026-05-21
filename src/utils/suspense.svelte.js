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
 * 
 * @param {Roll} roll An resolved roll
 * @returns {string} The suspense id
 */
export function suspense(roll) {
    // Moves the result up or down by one
    let id = foundry.utils.randomID();
    if (!roll.result) throw new TypeError("Roll must be rolled before you suspense it");

    suspenseSet.add(id);

    // Handle locally
    wait(roll, game.user).then(() => suspenseSet.delete(id));
    // Tell everyone else to handle it

    /** @@type {SuspenseBroadcast} */
    let payload = {
        id,
        user_id: game.user._id,
        roll_json: roll.toJSON()
    };
    sendSocket(ANIMON.socket.suspense, payload);

    return id;
}

/** The broadcast for a suspense thingy
 * @typedef {object} SuspenseBroadcast
 * @property {string} id Unique id of this "suspense item"
 * @property {string} user_id The id of the user performing the roll, for styling purposes
 * @property {object} roll_json The encoded roll of this suspense item. It should be resolved!
 */


/**
 * Wait for a roll to resolve via suspense settings
 * @param {Roll} roll 
 */
async function wait(roll, user) {
    if (game.dice3d) {
        await game.dice3d.showForRoll(roll, user, false);
    } else {
        await sleep(1000);
    }
}

/**
 * Handle incoming suspense events
 * @param {SuspenseBroadcast} payload Broadcast received from
 */
export function onReceiveSuspense(payload) {
    // Hydrate roll and dsn it
    let { roll_json, user_id, id } = payload;
    suspenseSet.add(id);
    let roll = Roll.fromData(roll_json);
    let user = game.users.get(user_id) ?? game.user;
    wait(roll, user).then(() => suspenseSet.delete(id));
}
// Our current things in suspense
const suspenseSet = new SvelteSet();

/**
 * 
 * @param {string} id The suspense id
 * @returns {boolean} True iff in suspense
 */
export function inSuspense(id) {
    return suspenseSet.has(id);
}