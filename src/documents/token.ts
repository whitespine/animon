
export class SystemToken extends foundry.canvas.placeables.Token {
    /**
     * Refresh presentation of the Token's combat turn marker, if logic differs from core logic.
     * @protected
     */
    /*
    _refreshTurnMarker() {
        // Should a Turn Marker be active?
        const { turnMarker } = this.document;
        const markersEnabled = CONFIG.Combat.settings.turnMarker.enabled
            && (turnMarker.mode !== CONST.TOKEN_TURN_MARKER_MODES.DISABLED);

        // BEGIN OVERRIDES
        const combat = game.combat;
        const isTurn = combat?.system.phase == "acts" && this.combatant?.system.set_dice.includes(combat?.system.act);
        // END OVERRIDES
        const markerActive = markersEnabled && isTurn;

        // Activate a Turn Marker
        if (markerActive) {
            if (!this.turnMarker) this.turnMarker = this.addChildAt(new foundry.canvas.placeables.tokens.TokenTurnMarker(this), 0);
            canvas.tokens.turnMarkers.add(this);
            this.turnMarker.draw();
        }

        // Remove a Turn Marker
        else if (this.turnMarker) {
            canvas.tokens.turnMarkers.delete(this);
            this.turnMarker.destroy();
            this.turnMarker = null;
        }
    }
    */
}

export class SystemTokenDocument extends foundry.documents.TokenDocument {
}