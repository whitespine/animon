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

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.actor = this.actor;
        return context;
    }

    // Helper for setting an image that also hits token if images are already in sync
    async setImage(img) {
        const mm = "icons/svg/mystery-man.svg";
        let current_token;
        let update = {
            img: img
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
            return this.actor.update(update).then(() => this.actor.token.update({
                "texture.src": img
            }));
        } else {
            // Sync em up
            update["prototypeToken.texture.src"] = img;
            return this.actor.update(update);
        }
    }
}

export class NPCSheet extends SvelteApplicationMixin(SystemActorSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["npc"],
        svelte: {
            component: NPCSheetComponent,
            props: {
                edit: false
            }
        },
        position: {
            width: 600,
            height: "auto"
        },
    }

    static actionToggleEdit(_evt, _target) {
        this.toggleEdit();
    }

    toggleEdit() {
        // Due to weird bindings, we can use `this`
        // This.props is a reactive state, and so will behave as we expect $props to generally behave!
        let edit = this.props.edit ?? false;
        edit = !edit;
        this.props.edit = edit;
        this.setPosition({
            width: edit ? 400 : 800,
            height: edit ? "auto" : 800,
        });
    }
}

export class KidSheet extends SvelteApplicationMixin(SystemActorSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["player"],
        svelte: {
            component: KidSheetComponent
        },
        position: {
            width: 600,
            height: 700
        },
        actions: {
        }
    }
}

export class AnimonSheet extends SvelteApplicationMixin(SystemActorSheet) {
    static DEFAULT_OPTIONS = {
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
    }

    // Set kid
    _onDropActor(event, document) {
        if(document.type == "kid") {
            this.actor.update({"system.kid": document._id});
        }
    }
}