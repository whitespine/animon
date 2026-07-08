import type { SystemChatMessage } from "../../documents/message.svelte";
import { SortField } from "../base.svelte";
import { baseRollParams, type BaseRollParams } from "./base";
const fields = foundry.data.fields;

const defineContestedTestModel = () => ({
    contestants: new fields.TypedObjectField(new fields.SchemaField({
        params: new fields.SchemaField({
            ...baseRollParams(),
        }),
        alias: new fields.StringField(),
        pushed: new fields.BooleanField({ initial: false }), // Any roll can be pushed
        sort: new SortField(),
        suspense: new fields.StringField({ nullable: true, initial: null }),
        roll: new fields.JSONField(),
    })),
});

export interface ContestedTestParams extends BaseRollParams {}

type BaseData = {
    pushed: boolean,
    contestants: Record<string, {
        alias: string,
        sort: number,
        suspense: string | null,
        pushed: boolean,
        params: ContestedTestParams,
        roll: string // jsonified data
    }>,
    suspense: string | null
};
type DerivedData = BaseData & {};

export class ContestedTestModel extends foundry.abstract.TypeDataModel<ReturnType<typeof defineContestedTestModel>, SystemChatMessage, BaseData, DerivedData> {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return defineContestedTestModel();
    }
}
