import { MY_SYSTEM_CONSTS } from "../consts";


export class SystemCombat extends Combat {
    // ---------------------------------------------------
    // - Custom combats are hard to template
    // - Observe the doomsong tracker - it is esoteric, but should serve as a clear cut example of how to have non-traditional turn tracker
    // - See: https://github.com/whitespine/doomsong/blob/master/src/documents/combat.js
    // - See: https://github.com/whitespine/doomsong/blob/master/src/overrides/DoomsongCombatTracker.svelte.js
    // ---------------------------------------------------
}

export class SystemCombatant extends Combatant {
    get thumbnail() {
        return this.img ?? CONST.DEFAULT_TOKEN;
    }

    // Ping this combatant's token
    ping() {
        if (!canvas.ready || (this.sceneId !== canvas.scene.id)) return;
        const token = this.token?.object;
        if (!token || !token.visible) {
            ui.notifications.warn("COMBAT.WarnNonVisibleToken", { localize: true });
            return;
        }
        return canvas.ping(token.center);
    }
}