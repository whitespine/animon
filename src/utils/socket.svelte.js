import { ANIMON } from "../consts";

/**
 * Our example socket event sends a roll and alerts its result
 * @param {Any} payload The payload sent via sendSocket
 */
export function onReceiveExample(payload) {
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
            case ANIMON.socket.example:
                onReceiveExample(payload)
                break;
            default:
                ui.notifications.warn(`Unhandled animon event type ${type}`);
        }
    });
}

/**
 * 
 * @param {string} type The message type. Use something from ANIMON.socket
 * @param {any} payload Arbitrary json data
 * @returns {Promise<any>}
 */
export function sendSocket(type, payload) {
    return game.socket.emit(`system.${game.system.id}`, {
        type,
        payload
    });
}