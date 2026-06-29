import { ANIMON } from "../../../consts";
import { ControlState } from "../../../utils/control.svelte";
import { onlineOwners } from "../../../utils/ownership";
import { rollCheck } from "../../../utils/roll";

/**
 * Utility class singleton for managing the current configuration of our roller
 */
export class RollerState {
    speaker = $state({
        scene: null,
        token: null,
        actor: null,
        alias: null
    });
    actor = $derived(ChatMessage.getSpeakerActor(this.speaker));
    kid = $derived.by(() => {
        if (!this.actor) return null;
        if (this.actor.type == "kid") return this.actor;
        if (this.actor.type == "animon") return this.actor.system.kid ?? null;
        return null;
    })

    // For basic tests, the manually set difficulty
    difficulty = $state(2);
    // Our boost mode
    boost = $state(0);

    // Kid specific
    talent_id = $state(""); // An id
    talent = $derived(this.actor?.system.talents?.[this.talent_id] ?? null);
    talent_bonus = $derived(this.talent?.rank ?? 0);
    trait = $state("logic"); // logic, reflex, or spirit
    trait_bonus = $derived(this.actor?.system.trait?.[this.trait] ?? 0);

    // Mon specific
    stat = $state("heart"); // heart / power / agility brains
    stat_bonus = $derived(this.actor?.system.form?.stats[this.stat] ?? 0);
    quality_id = $state("");
    quality = $derived.by(() => {
        if (this.actor?.type != "animon") return 0;
        for (let form of Object.values(this.actor.system.forms)) {
            if (form.qualities[this.quality_id]) {
                return form.qualities[this.quality_id];
            }
        }
        return null;
    });
    quality_bonus = $derived(this.quality?.rank ?? 0);
    signature_id = $state(""); // Technically the id of the form
    signature = $derived(this.actor?.system.forms?.[this.signature_id]?.signature);
    signature_bonus = $derived(this.signature?.rank ?? 0);

    // Kid/mon but not npc
    bond_points_spent = $state(0);
    bond_points_bonus_dice = $derived(this.bond_points_spent > 0 ? 1 + this.bond_points_spent : 0);

    // Other bonuses and adjustments
    final_mod = $state(0);

    // We derive this. Don't try to override, use final_mod
    dice_pool = $derived(this.trait_bonus + this.talent_bonus + this.stat_bonus + this.quality_bonus + this.bond_points_bonus_dice + this.final_mod);

    /**
     * Reset all attributes to default
     */
    reset() {
        this.difficulty = 2;
        this.boost = 0;
        this.trait = "logic"
        this.talent_id = "";
        this.stat = "heart"
        this.quality_id = "";
        this.signature_id = "";
        this.bond_points_spent = 0;
        this.final_mod = 0;
    }

    async roll() {
        let contributors = [];
        if (this.actor?.type === "kid") {
            contributors.push({
                key: "trait",
                label: this.trait,
                value: this.trait_bonus
            });
            if (this.talent) {
                contributors.push({
                    key: "talent",
                    label: this.talent.name,
                    value: this.talent_bonus
                });
            }
        } else if (this.actor?.type === "animon") {
            contributors.push({
                key: "stat",
                label: this.stat,
                value: this.stat_bonus
            });
            if (this.quality) {
                contributors.push({
                    key: "quality",
                    label: this.quality.name,
                    value: this.quality_bonus
                });
            }
            if (this.signature) {
                contributors.push({
                    key: "signature",
                    label: this.signature.name,
                    value: this.signature_bonus
                });
            }
        } else {
            // Fallback - just dice pool
            contributors.push({
                key: "manual",
                label: "Manual Pool",
                value: this.final_mod
            });
        }
        if (this.actor && this.bond_points_spent) {
            contributors.push({
                key: "bond_points",
                label: "Bond Points",
                value: this.final_mod
            });
        }

        // Add boost modifier
        if (this.boost) {
            message += {
                1: " BOOST",
                2: " BOOST+",
                [-1]: " SETBACK",
                [-2]: " SETBACK+",
            }[this.boost] ?? "";
        }

        // Deduct bond points
        if (this.kid && this.bond_points_spent) {
            this.kid.update({
                "system.bond_points.value": this.kid.system.bond_points.value - this.bond_points_spent
            });
        }

        // Deduct signature_uses
        else if (this.actor?.type == "animon" && this.signature) {
            this.actor.update({
                "system.signature_uses.value": this.actor.system.signature_uses.value - 1
            });
        }

        await rollCheck({
            dice_pool: this.dice_pool,
            boost: this.boost,
            difficulty: this.difficulty,
            contributors,
            bond_points_spent: this.bond_points_spent
        }, ControlState.speaker);
    }
}

class _GlobalRollerState extends RollerState {
    /** Is the roller currently visible?
     * 
     * @type {boolean} 
     */
    visible = $state(false);

    // Summon it without an actor!
    show() {
        this.visible = true;
    }
}

/** @type {RollerState} */
export const GlobalRollerState = new _GlobalRollerState();