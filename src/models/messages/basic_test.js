import { baseRollParams } from "./base";
const fields = foundry.data.fields;

export class BasicTestModel extends foundry.abstract.TypeDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            pushed: new fields.BooleanField({ initial: false }), // Any roll can be pushed
            params: new fields.SchemaField({
                ...baseRollParams(),
                difficulty: new fields.NumberField({ integer: true, initial: 2, min: 1 }),
            }),
            // Suspense on the roll. We only need one
            suspense: new fields.StringField({ nullable: true, initial: null })
        };
    }
}
