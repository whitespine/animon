import type { DeepPartial } from "fvtt-types/utils";
import ContestComponent from "../components/rolls/Contest.svelte";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import type { ContestChatMessage, SystemChatMessage } from "../documents/message.svelte";

export interface ContestContext {
    message: ContestChatMessage,
    contestant_uuid: string
}

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

    static keyFor(ctx: ContestContext) {
        return `${ctx.message.id}:${ctx.contestant_uuid}`;
        }

    static register(app: ContestedApp) {
        this.active.set(this.keyFor(app.fixed_context), app);
    }

    static unregister(ctx: ContestContext): ContestedApp | null {
        let key = this.keyFor(ctx);
        let result = this.active.get(key);
        this.active.delete(key);
        return result ?? null;
    }

    static close(message: ContestChatMessage, contestant_uuid: string) {
        this.unregister({ contestant_uuid, message })?.close({ animate: false });
    }

    static closeAll(msg: ContestChatMessage) {
        for(let uuid of Object.keys(msg.system.contestants)) {
            this.close(msg, uuid);
        }
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
        super.close(options);
        ContestedApp.unregister(this.fixed_context);
        return this;
    }

    async _prepareContext() {
        return this.fixed_context;
    }
}

export function initContestOpenHooks() {
    // On create contest chat message, summon a Contest app for each contestant we own
    Hooks.on("createChatMessage", (acm) => {
        if (acm.type === "contested_test") {
            let message = acm as SystemChatMessage<"contested_test">;
            let contestants = message.system.contestants;
            for (let uuid of Object.keys(contestants)) {
                let actor = foundry.utils.fromUuidSync(uuid) as Actor | undefined;
                if (actor && actor.isOwner) {
                    let app = new ContestedApp({
                        message,
                        contestant_uuid: uuid
                    });
                    app.render({ force: true })
                }
            }
        }
    });

    // On update contest chat message, close any pending contest app for any contestants that have had their rolls submitted
    Hooks.on("updateChatMessage", (acm, mod) => {
        if (acm.type === "contested_test") {
            let message = acm as ContestChatMessage;
            let system_contestant_changes: Record<string, any> = (mod as any)["system"]?.["contestants"] ?? {};
            for(let [k, v] of Object.entries(system_contestant_changes)) {
                if(v.roll) {
                    ContestedApp.close(message, k);
                }
            }
        }
    })
}