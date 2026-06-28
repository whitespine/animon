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
        if(!this.actor) return null;
        if(this.actor.type == "kid") return this.actor;
        if(this.actor.type == "animon") return this.actor.system.kid ?? null;
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
        if(this.actor?.type != "animon") return 0;
        for(let form of Object.values(this.actor.system.forms)) {
            if(form.qualities[this.quality_id]) {
                return form.qualities[this.quality_id];
            }
        }
        return null;
    });
    quality_bonus = $derived(this.quality?.rank ?? 0);

    // Kid/mon but not npc
    bond_points_spent = $state(0);
    bond_points_bonus_dice = $derived(this.bond_points_spent > 0 ? 1 + this.bond_points_spent : 0);

    // Other bonuses and adjustments
    final_mod = $state(0);

    // We derive this. Don't try to override, use final_mod
    dice_pool = $derived(this.trait_bonus + this.talent_bonus + this.stat_bonus + this.quality_bonus + this.bond_points_bonus_dice + this.final_mod);

    // Summon it without an actor!
    show() {
        this.visible = true;
    }

    async roll() {
        let message = "";
        if(this.actor?.type === "kid") {
            message = `${this.trait} [${this.trait_bonus}]`
            if(this.talent) {
                message += ` + ${this.talent.name} [${this.talent.rank}]`;
            }
        } else if(this.actor?.type === "animon") {
            message = `${this.stat} [${this.stat_bonus}]`
            if(this.quality) {
                message += ` + ${this.quality.name} [${this.quality.rank}]`;
            }
        } else {
            // Fallback - just dice pool
            message = `Manual Dice Pool [${this.final_mod}]`;
        }
        if(this.actor && this.bond_points_spent) {
            message += ` + ${this.bond_points_spent} Bond Points [${this.bond_points_bonus_dice}]`;
        }

        // Add boost modifier
        if(this.boost) {
            message += {
                1: " BOOST",
                2: " BOOST+",
                [-1]: " SETBACK",
                [-2]: " SETBACK+",
            }[this.boost] ?? "";
        }

        // Deduct bond points
        if(this.actor?.system.bond_points?.value && this.bond_points_spent) {
            this.actor.update({
                "system.bond_points.value": this.actor.system.bond_points.value - this.bond_points_spent
            });
        }

        await rollCheck({
            dice_pool: this.dice_pool,
            boost: this.boost,
            difficulty: this.difficulty,
            human_friendly_roll: message,
            bond_points_spent: this.bond_points_spent
        }, ControlState.speaker);
        this.bond_points_spent = 0;
    }
}

class _GlobalRollerState extends RollerState {
    /** Is the roller currently visible?
     * 
     * @type {boolean} 
     */
    visible = $state(false);
}

/** @type {RollerState} */
export const GlobalRollerState = new _GlobalRollerState();