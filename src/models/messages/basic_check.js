const fields = foundry.data.fields;

export class BasicCheckModel extends foundry.abstract.TypeDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            pushed: new fields.BooleanField({ initial: false }),
            params: new fields.SchemaField({
                mode: new fields.StringField({
                    choices: ["standard", "disadvantage", "advantage"],
                    initial: "standard"
                }),
                difficulty: new fields.NumberField({ required: true }),
                bonus: new fields.NumberField({ required: true, initial: 0 }),
            }),
            suspense: new fields.StringField({ nullable: true, initial: null })
        };
    }
}
