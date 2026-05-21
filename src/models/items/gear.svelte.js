import { ItemModel } from "./item.svelte";

const fields = foundry.data.fields;

export class GearModel extends ItemModel {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return {
            ...super.defineSchema(),
            // Basic item info
            bulk: new fields.NumberField({ integer: true, min: 0, initial: 1 }), // How much space does this take up

            // If true, consider this gear "ready"
            ready: new fields.BooleanField({ initial: true })
        };
    }
}
