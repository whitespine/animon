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
        let spc = await super._preCreate(data, options, user);
        if (spc === false) return spc;

        let mods = {}

        // Set token defaults
        if (!data.prototypeToken?.displayBars) {
            mods["prototypeToken.displayBars"] = 50;
        }
        if (!data.prototypeToken?.displayName) {
            mods["prototypeToken.displayName"] = 50;
        }
        if (!data.prototypeToken?.bar1?.attribute) {
            mods["prototypeToken.bar1.attribute"] = {
                "kid": "stamina",
                "animon": "hp"
            }[data.type];
        }
        if (!data.prototypeToken?.bar2?.attribute) {
            mods["prototypeToken.bar2.attribute"] = {
                "kid": "bond_points",
                "animon": "signature_uses"
            }[data.type];
        }

        // Set actorlink defaults
        if (data.prototypeToken?.actorLink == undefined) {
            mods["prototypeToken.actorLink"] = ["kid", "animon"].includes(data.type);
        }

        // Set disposition defaults
        if (data.prototypeToken?.disposition == undefined) {
            mods["prototypeToken.disposition"] = {
                "player": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                "animon": CONST.TOKEN_DISPOSITIONS.NEUTRAL, // More for coloration
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

    // Extend allApplicableEffects to yield data model generated effects
    _upgradeEffects() {
        return this.effects.contents.filter(e => e.type == "upgrade" && e.system.category == "score");
    }

    /**
     * Generate a comparable hash of our current upgrade effects
     */
    _upgradeEffectsHash() {
        return JSON.stringify(this._upgradeEffects().map(ue => ue._source));
    }

    _oldUpgradeEffectsHash = this._upgradeEffectsHash();

    /**
     * Augment existing embedded document change logic to watch for
     * changes to our upgrade effects hash, and push down effects when appropriate
     */
    _onEmbeddedDocumentChange() {
        super._onEmbeddedDocumentChange();

        let newPushdownCache = this._upgradeEffectsHash();
        if (this.type == "kid" && newPushdownCache != this._upgradeEffectsHash) {
            this.pushdownEffects();
        }
    }

    /**
     * For each of our linked mons, purge all existing "upgrade" effects, and create new ones
     */
    async pushdownEffects(target = null) {
        let targets = target ? [target] : this.system.mons;
        let effects = this._upgradeEffects();
        let promises = [];
        for (let target of targets) {
            let old_effects = target.effects.filter(x => x.type === "upgrade");
            let target_promise = target.deleteEmbeddedDocuments("ActiveEffect", old_effects.map(e => e._id));
            target_promise.then(() => {
                return target.createEmbeddedDocuments("ActiveEffect", effects.map(e => e.toObject(true)));
            });
            promises.push(target_promise);
        }
        await Promise.all(promises);
        this._oldUpgradeEffectsHash = this._upgradeEffectsHash();
    }
}