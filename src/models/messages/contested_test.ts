import type { SystemChatMessage } from "../../documents/message.svelte";
import { SortField } from "../base.svelte";
import { baseRollParams, type BaseRollParams } from "./base";
const fields = foundry.data.fields;

const defineContestedTestModel = () => ({
    title: new fields.StringField({ initial: "Contest" }),
    subtitle: new fields.StringField({ initial: "" }),
    contestants: new fields.TypedObjectField(new fields.SchemaField({
        actor: new fields.StringField({ nullable: false }),
        params: new fields.SchemaField({
            ...baseRollParams(),
        }, { nullable: true, initial: null }),
        prompt: new fields.StringField(),
        pushed: new fields.BooleanField({ initial: false }), // Any roll can be pushed
        sort: new SortField(),
        suspense: new fields.StringField({ nullable: true, initial: null }),
        roll: new fields.JSONField({ nullable: true, initial: null }),
    })),
});

export interface ContestedTestParams extends BaseRollParams { }

export type BaseData = {
    title: string,
    pushed: boolean,
    contestants: Record<string, {
        actor: string,
        prompt: string,
        sort: number,
        suspense: string | null,
        pushed: boolean,
        params: ContestedTestParams | null,
        roll: string | null // jsonified data
    }>,
    suspense: string | null
};
type DerivedData = {
    title: string,
    pushed: boolean,
    contestants: Record<string, {
        actor: Actor | null,
        prompt: string,
        sort: number,
        suspense: string | null,
        pushed: boolean,
        params: ContestedTestParams | null,
        roll: Roll | null // de-jsonified data
    }>,
    suspense: string | null
};

export class ContestedTestModel extends foundry.abstract.TypeDataModel<ReturnType<typeof defineContestedTestModel>, SystemChatMessage, BaseData, DerivedData> {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return defineContestedTestModel();
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        // Create Roll instances for contained dice rolls
        for (let contestant of Object.values(this.contestants)) {
            // @ts-ignore
            contestant.actor = foundry.utils.fromUuidSync(contestant.actor);
            if (contestant.roll) {
                try {
                    // @ts-ignore
                    contestant.roll = Roll.fromData(contestant.roll);
                } catch (err) {
                    contestant.roll = null;
                }
            }
        }
    }
}
