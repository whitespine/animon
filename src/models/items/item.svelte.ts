import type { EmptyObject, InterfaceToObject } from "fvtt-types/utils";
import type { SystemItem } from "../../documents/item.svelte";

const fields = foundry.data.fields;

export class ItemModel<
    Schema extends foundry.data.fields.DataSchema,
    Parent extends SystemItem,
    BaseData extends object = EmptyObject,
    DerivedData extends object = EmptyObject> extends foundry.abstract.TypeDataModel<Schema, Parent, InterfaceToObject<BaseData>, InterfaceToObject<DerivedData>> {
}
