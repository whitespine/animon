import { ItemModel } from "./item.svelte";
import loc from "../../utils/localize";

const fields = foundry.data.fields;

export class UpgradeModel extends ItemModel {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // We strictly limit category
            category: new fields.StringField({ choices: ["minor", "major", "score"] }),

            // Keys aren't strictly categorized, but some will have no effect
            // Should match localization keys
            key: new fields.StringField({ required: true }),

            // For player tracking of what they applied their upgrade to
            notes: new fields.StringField({ required: true }),

            // The level at which this was acquired. Used for warning against repeat choices, etc
            level: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        };
    }

    static keysFor(category) {
        return {
            "minor": ["talent", "quality"],
            "major": ["talent", "quality", "effect", "signature", "minor"],
            "score": ["hp", "damage", "dodge", "sig_init"]
        }[category] ?? [];
    }

    *generatedEffects() {
        // TODO: Yield generated upgrade effects
        if (this.category == "score") {
            const base = {
                type: "upgrade",
                name: this.name
            };

            if (this.key == "hp") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.bonuses.hp",
                        type: "add",
                        value: 5
                    }],
                };
            } else if (this.key == "damage") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.bonuses.damage",
                        type: "add",
                        value: 2
                    }],
                };
            } else if (this.key == "dodge") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.bonuses.dodge",
                        type: "add",
                        value: 1
                    }],
                };
            } else if (this.key == "sig_init") {
                yield {
                    ...base,
                    changes: [{
                        key: "system.bonuses.initiative",
                        type: "add",
                        value: 1
                    }, {
                        key: "system.bonuses.signature",
                        type: "add",
                        value: 1
                    }],
                };
            }

        }
        // No other types of effects actually require active effects
    }

    prepareDerivedData() {
        this.localized_short = loc(`animon.upgrade.${this.category}.${this.key}.short`) ?? "UNKNOWN";
        this.localized_description = loc(`animon.upgrade.${this.category}.${this.key}.full`) ?? "UNKNOWN";
    }
}
