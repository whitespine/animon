import { SystemDataModel } from "../base.svelte";

const fields = foundry.data.fields;

export class ActorModel extends SystemDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Basic stats, expand as necessary
            hp: new fields.SchemaField({
                // min: NumberField({ integer: true, min: 0, initial: 0 }), 
                max: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
                value: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
            }),
            power: new fields.NumberField({ integer: true, min: 0, initial: 0 }),

            // Notes. Handy to have, might not keep forever
            biography: new fields.HTMLField({ initial: "Put notes here" })
        };
    }


    // Derived bonuses can be created via svelte derived attributes,
    // or in the more traditional prepareData workflows
    attack_bonus = $derived(Math.min(this.power, 5));
    gear = $derived(this.parent.items.filter(i => i.type == "gear"));

    // Migrations - always a pain! This is run every time the document is updated. 
    // Keep it simple, and consider doing a more permanent migration as an update hook instead
    static migrateData(sourceData) {
        // Fix traits to be schema instead of + prefixed data
        if(sourceData.old_power && sourceData.power == null) {
            sourceData.power = sourceData.old_power;
        }
        return sourceData;
    }
}
