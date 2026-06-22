import { ANIMON } from "../../../consts";
import { onlineOwners } from "../../../utils/ownership";
import { rollCheck } from "../../../utils/roll";

/**
 * Utility singleton for managing the current configuration of our roller
 */
class _RollerState {

    /** visible Is the roller currently visible?
     * @type {boolean} 
     */
    visible = $state(false);

    /** @type {Actor | null} 
     * Who would we be rolling as? null = use anon roll behavior
     */
    actor = $state(null);

    /**
     * @type {import("../../../utils/roll").CheckParams}
     */
    params = $state({
        // A superset of all Check params
        mode: "basic",
        difficulty: 2,
        dice_pool: 0,
        bond_points_spent: 0,
        boost: 0,
        talent: "",
        trait: "logic", // logic, reflex, or spirit
        stat: "heart", // heart / power / agility brains
        talent: "",
        talent_bonus: 0, // We don't do this reactively, for simplicity
        quality: "",
        quality_bonus: 0, // We don't do this reactively, for simplicity

    });

    // Summon it without an actor!
    show() {
        this.visible = true;
    }

    roll() {
        rollCheck(this.params, this.actor);
    }
}

/** @type {_RollerState} */
export const RollerState = new _RollerState();