import CustomCombatTrackerComponent from '../components/combat/CombatTracker.svelte'
import { SvelteApplicationMixin } from './svelte_mixin.svelte';

export class CustomCombatTracker extends SvelteApplicationMixin(foundry.applications.sidebar.AbstractSidebarTab) {

    static DEFAULT_OPTIONS = {
        window: {
            title: "COMBAT.SidebarTitle"
        },
        svelte: {
            component: CustomCombatTrackerComponent
        },
        classes: ["animon"]
    }

    static tabName = "combat";

    get viewed() {
        return game.combats.find(x => x.active);
    }

    // Hook us into the render updates. Don't need anything else
    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);
        if (!this.isPopout) game.combats.apps.push(this);
    }

    async _prepareContext() {
        // TODO: Theoretically, there are cases where multiple active combats could exist. Expand this logic 
        let combat = game.combats.find(x => x.active);
        return {
            combat
        };
    }

    // Required method
    _isTokenVisible(token) {
        return token.visible;
    }

    hoverCombatant(combatant, hovered) {
        this.props.highlighted = hovered ? combatant.tokenId : null;
    }
}