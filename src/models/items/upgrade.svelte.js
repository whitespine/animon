import { ItemModel } from "./item.svelte";

const fields = foundry.data.fields;

export class UpgradeModel extends ItemModel {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // We strictly limit category
            category: new fields.StringField({choices: ["minor", "major", "score"]}),

            // Keys aren't strictly categorized, but some will have no effect
            // Should match localization keys
            key: new fields.StringField(),

            // For player tracking of what they applied their upgrade to
            note: new fields.StringField(),

            // The level at which this was acquired. Used for warning against repeat choices, etc
            level: new fields.NumberField({integer: true, min: 0, initial: 0}),
        };
    }

    *generatedEffects() {
        // TODO: Yield generated upgrade effects
        if(this.category == "score") {
            const base = {
                type: "upgrade",
                name: this.name
            };

            if(this.key == "hp") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.hp.max",
                        type: "add",
                        value: 5
                    }],
                };
            } else if(this.key == "damage") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.stats.damage",
                        type: "add",
                        value: 2
                    }],
                };
            } else if(this.key == "dodge") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.stats.dodge",
                        type: "add",
                        value: 1
                    }],
                };
            } else if(this.key == "damage") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.stats.initiative",
                        type: "add",
                        value: 1
                    }, {
                        key: "system.signature_uses.max",
                        type: "add",
                        value: 1
                    }],
                };
            }

        }
        // No other types of effects actually require active effects
    }
}
