/** @import {Consequence} from "../utils/roll" */

import type { UpgradeEffect } from "./effect";

/**
 * Our custom class for Actors
 */
export class SystemActor<SubType extends Actor.SubType = Actor.SubType> extends Actor<SubType> {
    /* @override
     * This is the best place to overwrite "top level" properties like name 
     * and prototype token attributes. Otherwise, use models
     */
    async  _preCreate(...[data, options, user]: Parameters<Actor["_preCreate"]>) {
        let spc = await super._preCreate(data, options, user);
        if (spc === false) return spc;

        let mods: Record<string, any> = {}

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
                "animon": "hp",
                "npc": "hp"
            }[data.type as string];
        }
        if (!data.prototypeToken?.bar2?.attribute) {
            mods["prototypeToken.bar2.attribute"] = {
                "kid": "bond_points",
                "animon": "signature_uses",
            }[data.type as string];
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
            }[data.type as string] || CONST.TOKEN_DISPOSITIONS.NEUTRAL;
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


    _oldHp = (this as AnimonActor | NpcActor).system.hp?.value;
    /**
     * Show a scrolling stat change for our attributes, if they change
     * TODO: This might be more easily accomplished?
     */
    _showDeltaStats() {
        if(this.isAnimon() || this.isNpc()) {
            let hp_delta = (this.system.hp?.value ?? 0) - (this._oldHp ?? 0);
            if (hp_delta) {
                this._oldHp = this.system.hp?.value;
                this._displayScrollingDelta("Hit Points", hp_delta);
            }
        }
    }

    /**
       * Display changes to active effects as scrolling Token status text.
       * @param {boolean} enabled     Is the active effect currently enabled?
       * @protected
       */
    _displayScrollingDelta(attribute: string, delta: number) {
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
    _upgradeEffects(): UpgradeEffect[] {
        return this.effects.contents.filter(e => e.type == "upgrade" && e.system.category == "score") as UpgradeEffect[];
    }

    /**
     * Generate a comparable hash of our current upgrade effects
     */
    _upgradeEffectsHash(): string {
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
        if (this.type == "kid" && newPushdownCache != this._upgradeEffectsHash()) {
            this.pushdownEffects();
        }
    }

    /**
     * For each of our linked mons, purge all existing "upgrade" effects, and create new ones
     */
    async pushdownEffects(target?: AnimonActor) {
        if(this.type != "kid") return;
        let targets = target ? [target] : (this as KidActor).system.mons;
        let new_effects = this._upgradeEffects();

        const push = async (t: AnimonActor) => {
            // console.log(`-------------`);
            // console.log(`Pushing to ${t.name}`);
            let old_effects = t.effects.filter(x => x.type === "upgrade");
            // console.log(`${old_effects.length} old effects`);
            await t.deleteEmbeddedDocuments("ActiveEffect", old_effects.map(e => e._id));
            // console.log(`${new_effects.length} new effects`);
            await t.createEmbeddedDocuments("ActiveEffect", new_effects.map(e => e.toObject(true)));
            // console.log(`Pushed to ${t.name}`);
        };

        await Promise.all(targets.map(push));
        this._oldUpgradeEffectsHash = this._upgradeEffectsHash();
    }

    isKid(): this is KidActor {
        return this.type == "kid";
    }

    isAnimon(): this is AnimonActor {
        return this.type == "animon";
    }

    isNpc(): this is NpcActor {
        return this.type == "npc";
    }
}

export type KidActor = SystemActor<"kid">;
export type AnimonActor = SystemActor<"animon">;
export type NpcActor = SystemActor<"npc">;