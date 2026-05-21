import { SystemDataModel } from "../base.svelte";

const fields = foundry.data.fields;

export class ActorModel extends SystemDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // For the time being, nothing is shared
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
