import type { UpgradeEffect, NpcUpgradeEffect } from "../documents/effect";
import { SvelteApplicationMixin, type RenderContextFor } from "../overrides/svelte_mixin.svelte";
import UpgradeSheetComponent from "../components/sheets/items/UpgradeSheet.svelte";

export class CustomEffectSheet<T extends ActiveEffect> extends foundry.applications.api.DocumentSheetV2<T> {
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
}

export class UpgradeSheet extends SvelteApplicationMixin<
    RenderContextFor<CustomEffectSheet<UpgradeEffect>>, 
    typeof CustomEffectSheet<UpgradeEffect>
>(CustomEffectSheet<UpgradeEffect>) {
    static DEFAULT_OPTIONS = {
        ...super.DEFAULT_OPTIONS,
        classes: ["upgrade"],
        svelte: {
            component: UpgradeSheetComponent
        },
        position: {
            width: 600,
            height: "auto" as const
        }
    }
}