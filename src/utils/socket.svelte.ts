import { ANIMON } from "../consts";
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
            case ANIMON.socket.suspense:
                onReceiveSuspense(payload);
                break;
            case ANIMON.socket.gm_edit_message:
                onGMEditMessage(payload);
                break;
            default:
                ui.notifications.warn(`Unhandled animon event type ${type}`);
        }
    });
}

type SocketEvent = /*typeof ANIMON.socket.contest_response |*/ typeof ANIMON.socket.suspense | typeof ANIMON.socket.gm_edit_message;
type SocketPayload = {
    // [ANIMON.socket.contest_response]: RespondContestBroadcast,
    [ANIMON.socket.suspense]: SuspenseBroadcast,
    [ANIMON.socket.gm_edit_message]: GMEditMessageRequest,
}

// Todo we probably want to correlate string and payload
export function sendSocket<T extends SocketEvent>(type: T, payload: SocketPayload[T]) {
    return game.socket.emit(`system.${game.system.id}`, {
        type,
        payload
    });
}

export function gmEditMessage<T extends ChatMessage>(message: T, update: Parameters<T["update"]>[0]) {
    if(game.user.isGM || message.isOwner) {
        // We can handle it
        message.update(update);
    } else {
        if(!message.id) return console.warn("GM cannot edit an ephemeral message");
        // Let a gm handle it
        sendSocket(ANIMON.socket.gm_edit_message, {
            id: message.id,
            edit: update
        });
    }
}

type GMEditMessageRequest = {
    id: string,
    edit: any
};

function onGMEditMessage(request: GMEditMessageRequest) {
    if(game.user.isGM) {
        game.messages.get(request.id)?.update(request.edit);
    }
}