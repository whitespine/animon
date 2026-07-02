import type { SystemChatMessage } from "../../documents/message.svelte";
import { baseRollParams, type BaseRollParams } from "./base";
const fields = foundry.data.fields;

const defineBasicTestModel = () => ({
    pushed: new fields.BooleanField({ initial: false }), // Any roll can be pushed
    params: new fields.SchemaField({
        ...baseRollParams(),
        difficulty: new fields.NumberField({ integer: true, initial: 2, min: 1 }),
    }),
    // Suspense on the roll. We only need one
    suspense: new fields.StringField({ nullable: true, initial: null })
});

export interface BasicTestParams extends BaseRollParams {
    difficulty: number;
}

type BaseData = {
    pushed: boolean,
    params: BasicTestParams,
    suspense: string | null
};
type DerivedData = BaseData & {};

export class BasicTestModel extends foundry.abstract.TypeDataModel<ReturnType<typeof defineBasicTestModel>, SystemChatMessage, BaseData, DerivedData> {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return defineBasicTestModel();
    }
}
