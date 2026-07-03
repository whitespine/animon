import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import AnimonSheetComponent from "../components/sheets/animon/AnimonSheet.svelte";
import NPCSheetComponent from "../components/sheets/npc/NPCSheet.svelte";
import KidSheetComponent from "../components/sheets/kid/KidSheet.svelte";

export class SystemActorSheet extends foundry.applications.sheets.ActorSheetV2 {
    static DEFAULT_OPTIONS = {
        classes: ["animon", "actor"],
        closeOnSubmit: false,
        submit: false,
        submitOnClose: false,
        submitOnChange: false,
        baseApplication: "ActorSheet",
        window: {
            resizable: true,
        }
    }

    // Helper for setting an image that also hits token if images are already in sync
    async setImage(img: string) {
        const mm = "icons/svg/mystery-man.svg";
        let current_token;
        let update = {
            img: img,
            prototypeToken: {
                texture: {
                    src: undefined as string | undefined
                }
            }
        };
        if (this.actor.token) {
            current_token = this.actor.token.texture.src;
        } else {
            current_token = this.actor.prototypeToken.texture.src;
        }
        let sync = this.actor.img == current_token || current_token == mm;
        if (!sync) {
            return this.actor.update(update);
        } else if (this.actor.token) {
            return this.actor.update(update).then(() => this.actor.token!.update({
                texture: {
                    src: img
                }
            }));
        } else {
            // Sync em up
            update.prototypeToken.texture.src = img;
            return this.actor.update(update);
        }
    }
}

export class NPCSheet extends SvelteApplicationMixin(SystemActorSheet) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject({
        classes: ["npc"],
        svelte: {
            component: NPCSheetComponent,
            props: {
                edit: false
            }
        },
        position: {
            width: 600,
            height: "auto" as const
        },
    }, super.DEFAULT_OPTIONS)
}

export class KidSheet extends SvelteApplicationMixin(SystemActorSheet) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject({
        classes: ["player"],
        svelte: {
            component: KidSheetComponent
        },
        position: {
            width: 600,
            height: "auto" as const
        },
        actions: {
        }
    }, super.DEFAULT_OPTIONS);
}

export class AnimonSheet extends SvelteApplicationMixin(SystemActorSheet) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject({
        classes: ["mon"],
        svelte: {
            component: AnimonSheetComponent
        },
        position: {
            width: 600,
            height: 700
        },
        actions: {
        }
    }, super.DEFAULT_OPTIONS);

    // Set kid
    async _onDropActor(_event: Event, document: Actor) {
        if (document.type == "kid") {
            //@ts-ignore
            this.actor.update({ "system.kid": document._id });
        }
        return null;
    }
}