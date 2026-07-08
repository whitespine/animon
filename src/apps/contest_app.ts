import type { DeepPartial } from "fvtt-types/utils";
import ContestComponent from "../components/rolls/Contest.svelte";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";

export interface ContestContext {
    message_id: string,
    contestant_uuid: string,
    actor: Actor,
    prompt: string
}

type ContestantKey = Pick<ContestContext, "message_id" | "contestant_uuid">;

export class ContestedApp 
extends SvelteApplicationMixin<ContestContext, typeof foundry.applications.api.ApplicationV2<ContestContext>>
(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject({
        classes: ["contest"],
        svelte: {
            component: ContestComponent,
        },
        position: {
            // TODO - some random scatter so they don't all stack up exactly
            top: 0,
            left: 0,
            width: 400,
            height: "auto" as const
        },
    }, super.DEFAULT_OPTIONS)

    fixed_context: ContestContext;

    static active = new Map<string, ContestedApp>();

    static keyFor(k: ContestantKey) {
        return `${k.message_id}:${k.contestant_uuid}`;
    }

    static register(app: ContestedApp) {
        this.active.set(this.keyFor(app.fixed_context), app);
    }

    static unregister(k: ContestantKey): ContestedApp | null {
        let key = this.keyFor(k);
        let result = this.active.get(key);
        this.active.delete(key);
        return result ?? null;
    }

    static closeAll(k: ContestantKey) {
        this.unregister(k)?.close({ animate: false });
    }


    constructor(context: ContestContext, options: DeepPartial<foundry.applications.api.ApplicationV2.RenderOptions> = {}) {
        let ui_rects = document.querySelector("#ui-middle")!.getClientRects()[0];
        options.position ??= {};
        options.position.top ??= Math.floor(ui_rects.top + ui_rects.height * (0.3 + Math.random() * 0.4));
        options.position.left ??= Math.floor(ui_rects.left + ui_rects.width * (0.3 + Math.random() * 0.4));

        super(options as any); // Idk lol
        this.fixed_context = context;
        ContestedApp.register(this);
    }

    async close(options?: { animate?: boolean | undefined; closeKey?: boolean | undefined; submitted?: boolean | undefined; }): Promise<this> {
        ContestedApp.unregister(this.fixed_context);
        return this;
    }

    async _prepareContext() {
        return this.fixed_context;
    }
}