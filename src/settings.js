import { ANIMON } from "./consts";

/**
 * Registers all system settings
 */
export function setupSettings() {
    // Have we shown the user a welcome message?
    game.settings.register(game.system.id, ANIMON.settings.init.welcome, {
        name: "Show Welcome Message",
        scope: "world",
        config: false,
        type: Boolean,
        default: true,
    });    
}