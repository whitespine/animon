import type { InterfaceToObject } from "fvtt-types/utils";
import type { GearItem } from "../../documents/item.svelte";
import { ItemModel } from "./item.svelte";

const fields = foundry.data.fields;

const defineGearSchema = () => ({

})

type GearSchema = ReturnType<typeof defineGearSchema>;

interface BaseData {}
interface DerivedData {}
export class GearModel extends ItemModel<GearSchema, GearItem, BaseData, DerivedData> {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return defineGearSchema();
    }
}
