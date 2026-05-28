const fields = foundry.data.fields;

export class ActorModel extends foundry.abstract.TypeDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // For the time being, nothing is shared
        };
    }


    // Derived bonuses can be created via svelte derived attributes,
    // or in the more traditional prepareData workflows
    // attack_bonus = $derived(Math.min(this.power, 5));
    // Having this here makes some greedily reactive components happier that its not initially null
    sv_items = $state([]);

    // For all actors we at least prepare a sorted reactive array in the form of sv_items
    prepareBaseData() {
        let items = Array.from(this.parent.items.svelte.values());
        items.sort((a, b) => a.sort - b.sort);
        this.sv_items = items;
    }

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
