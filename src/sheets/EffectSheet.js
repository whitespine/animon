import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import UpgradeSheetComponent from "../components/sheets/items/UpgradeSheet.svelte";

export class CustomEffectSheet extends foundry.applications.api.DocumentSheetV2 {
    static DEFAULT_OPTIONS = {
        classes: ["animon", "active-effect"],
        closeOnSubmit: false,
        submit: false,
        submitOnClose: false,
        submitOnChange: false,
        baseApplication: "DocumentSheet",
        window: {
            resizable: true,
        }
    }
    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.effect = this.document;
        context.item = null;
        context.actor = null;
        if(context.effect.parent instanceof Item) {
            context.item = context.effect.parent;
            context.actor = item.parent;
        } else if(context.effect.parent instanceof Actor) {
            context.actor = context.effect.parent;
        }
        return context;
    }
}

export class UpgradeSheet extends SvelteApplicationMixin(CustomEffectSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["upgrade"],
        svelte: {
            component: UpgradeSheetComponent
        },
        position: {
            width: 600,
            height: "auto"
        }
    }
}