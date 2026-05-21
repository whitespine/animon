import { ActorModel } from "./actor.svelte";

const fields = foundry.data.fields;

export class NpcModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // Vibes.
            vibes: new fields.StringField({ initial: "" }),
        }
    }
}