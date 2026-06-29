const fields = foundry.data.fields;

export function baseRollParams() {
    return {
        // Static computed contributions to the dice pool
        contributors: new fields.ArrayField(new fields.SchemaField({
            key: new fields.StringField(), // Semi static
            label: new fields.StringField(),
            value: new fields.NumberField()
        })),

        // The final computed dice pool
        dice_pool: new fields.NumberField({ initial: 1, min: 1, integer: true }),

        // Modifiers on the roll
        boost: new fields.NumberField({ min: -2, max: 2, initial: 0, integer: true }), // positive is boost, negative is bane

        // talents: new fields.SetField(new fields.StringField({required: true})), // 
        bond_points_spent: new fields.NumberField({ initial: 0, integer: true, min: 0 }) // We've already deducted, but just for visual aid
    }
}