import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import GearSheetComponent from "../components/sheets/items/GearSheet.svelte";
import UpgradeSheetComponent from "../components/sheets/items/UpgradeSheet.svelte";

export class CustomItemSheet extends foundry.applications.sheets.ItemSheetV2 {
    static DEFAULT_OPTIONS = {
        classes: ["animon", "item"],
        closeOnSubmit: false,
        submit: false,
        submitOnClose: false,
        submitOnChange: false,
        baseApplication: "ItemSheet",
        window: {
            resizable: true,
        }
    }

    // Stolen from foundry, modified. Summons a file picker
    async editImage(attr: string) {
        const current = foundry.utils.getProperty(this.document._source, attr) as string;
        const defaultArtwork = (this.document.constructor as any).getDefaultArtwork?.(this.document._source) ?? {};
        const defaultImage = foundry.utils.getProperty(defaultArtwork, attr) as string;
        // const fp = new FilePicker.implementation({ // v13
        const fp = new foundry.applications.apps.FilePicker({
            current,
            type: "image",
            redirectToRoot: defaultImage ? [defaultImage] : undefined,
            callback: path => this.item.update({"img": path}),
            position: {
                top: this.position.top + 40,
                left: this.position.left + 10
            }
        });
        await fp.browse();
    }
}

export class GearSheet extends SvelteApplicationMixin(CustomItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["gear"],
        svelte: {
            component: GearSheetComponent
        },
        position: {
            width: 600,
            height: "auto"
        }
    }
}

export class UpgradeSheet extends SvelteApplicationMixin(CustomItemSheet) {
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