const fields = foundry.data.fields;

export function baseRollParams() {
    return {
        // The final computed dice pool
        dice_pool: new fields.NumberField({ initial: 1, min: 1, integer: true }),

        // Modifiers on the roll
        boost: new fields.NumberField({ min: -2, max: 2, initial: 0, integer: true }), // positive is boost, negative is bane

        // Visual metadata on the roll
        human_friendly_roll: new fields.StringField(), // Visual Trait, if this was a kid roll

        // talents: new fields.SetField(new fields.StringField({required: true})), // 
        bond_points_spent: new fields.NumberField({ initial: 0, integer: true, min: 0 }) // We've already deducted, but just for visual aid
    }
}