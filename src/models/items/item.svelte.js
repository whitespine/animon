import { SystemDataModel } from "../base.svelte";

const fields = foundry.data.fields;

export class ItemModel extends SystemDataModel {
    // Some schema elements are consistent across all item types. Define them here
    static defineSchema() {
        return {
            // Rarely are items universal... but if any field needs to go everywhere, put it here!
        };
    }
}
