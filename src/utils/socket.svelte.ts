import { ANIMON } from "../consts";
import { onReceiveContestStart, onReceiveContestResponse, type RespondContestBroadcast, type StartContestBroadcast } from "./roll";
import { onReceiveSuspense, type SuspenseBroadcast } from "./suspense.svelte";

interface ExampleBroadcast {
    roll_json: Roll.Data,
    user_id: string,
    id: string
}

/**
 * Our example socket event sends a roll and alerts its result
 * @param {Any} payload The payload sent via sendSocket
 */
export function onReceiveExample(payload: ExampleBroadcast) {
    // Hydrate roll and dsn it
    let { roll_json, user_id, id } = payload;
    let roll = Roll.fromData(roll_json);
    alert(roll.result);
}

/**
 * Setup function for socket events
 */
export function initSockets() {
    game.socket.on(`system.${game.system.id}`, (data) => {
        let { type, payload } = data;
        switch (type) {
            case ANIMON.socket.contest_start:
                onReceiveContestStart(payload);
                break;
            case ANIMON.socket.contest_response:
                onReceiveContestResponse(payload);
                break;
            case ANIMON.socket.suspense:
                onReceiveSuspense(payload);
                break;
            default:
                ui.notifications.warn(`Unhandled animon event type ${type}`);
        }
    });
}

// Todo we probably want to correlate string and payload
export function sendSocket(type: string, payload: ExampleBroadcast | SuspenseBroadcast | StartContestBroadcast | RespondContestBroadcast) {
    return game.socket.emit(`system.${game.system.id}`, {
        type,
        payload
    });
}