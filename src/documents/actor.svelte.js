/** @import {Consequence} from "../utils/roll" */

import { GenericComponentApp } from "../apps/generic_app";

/**
 * Our custom class for Actors
 */
export class SystemActor extends Actor {
    /* @override
     * This is the best place to overwrite "top level" properties like name 
     * and prototype token attributes. Otherwise, use models
     */
    async _preCreate(...[data, options, user]) {
        await super._preCreate(data, options, user);

        let mods = {}

        // Set token defaults
        if (data.prototypeToken?.displayBars) {
            mods["prototypeToken.displayBars"] = 50;
        }
        if (data.prototypeToken?.displayName) {
            mods["prototypeToken.displayName"] = 50;
        }
        if (data.prototypeToken?.bar1?.attribute) {
            mods["prototypeToken.bar1.attribute"] = "toughness";
        }
        if (data.prototypeToken?.bar2?.attribute) {
            mods["prototypeToken.bar2.attribute"] = "toughness";
        }

        // Set actorlink defaults
        if (data.prototypeToken?.actorLink == undefined) {
            let link = data.type === "player";
            mods["prototypeToken.actorLink"] = link;
        }

        // Set disposition defaults
        if (data.prototypeToken?.disposition == undefined) {
            mods["prototypeToken.disposition"] = {
                "player": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                "npc": CONST.TOKEN_DISPOSITIONS.HOSTILE,
            }[data.type] || CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        }

        // Save only if necessary
        if (Object.keys(mods).length > 0) {
            this.updateSource(mods);
        }
    }

    // All we do here is show changes in stats
    prepareDerivedData() {
        super.prepareBaseData();
        this._showDeltaStats();
    }


    _oldHp = this.system.hp?.value;
    /**
     * Show a scrolling stat change for our attributes, if they change
     * TODO: This might be more easily accomplished?
     */
    _showDeltaStats() {
        let hp_delta = (this.system.hp?.value ?? 0) - (this._oldHp ?? 0);
        if (hp_delta) {
            this._oldHp = this.system.hp?.value;
            this._displayScrollingDelta("Hit Points", hp_delta);
        }
    }

    /**
       * Display changes to active effects as scrolling Token status text.
       * @param {boolean} enabled     Is the active effect currently enabled?
       * @protected
       */
    _displayScrollingDelta(attribute, delta) {
        const tokens = this.getActiveTokens(true);
        const text = `${delta > 0 ? "+" : ""}${delta} ${attribute}`;
        for (const token of tokens) {
            if (!token.visible || token.document.isSecret) continue;
            canvas.interface.createScrollingText(token.center, text, {
                anchor: CONST.TEXT_ANCHOR_POINTS.CENTER,
                direction: delta > 0 ? CONST.TEXT_ANCHOR_POINTS.TOP : CONST.TEXT_ANCHOR_POINTS.BOTTOM,
                distance: (2 * token.h),
                fontSize: 28,
                stroke: 0x000000,
                strokeThickness: 4,
                jitter: 0.25 // TODO experiment with this
            });
        }
    }

    // Can be removed in v14, replaced with a flag <-- what does this mean?
    /**
     * Return all effects on an actor that are temporary or have the `flags.[system].show` flag
     */
    get temporaryEffects() {
        const effects = [];
        for (const effect of this.allApplicableEffects()) {
            if (effect.active && effect.isTemporary) effects.push(effect);
            else if (effect.flags[game.system.id]?.show) effects.push(effect);
        }
        return effects;
    }
}