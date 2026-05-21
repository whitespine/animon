import { ANIMON } from "../../consts";
import { onlineOwners } from "../../utils/ownership";

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
     * @type {import("../../utils/roll").CheckParams}
     */
    params = $state({
        difficulty: 0,
        bonus: 0,
        mode: "standard"
    });

    // Summon it without an actor!
    show() {
        this.visible = true;
    }
}


export const RollerState = new _RollerState();