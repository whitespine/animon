import loc from "../../utils/localize";

const fields = foundry.data.fields;

// These are generated dynamically by upgrade items
export class UpgradeEffectModel extends foundry.data.ActiveEffectTypeDataModel {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return {
            ...super.defineSchema(), // We override `changes`, but its required
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

    get #changes() {
        // TODO: Yield generated upgrade effects
        if (this.category == "score") {
            if (this.key == "hp") {
                return [{
                    key: "system.bonuses.hp",
                    type: "add",
                    value: 5,
                    phase: "initial"
                }];
            } else if (this.key == "damage") {
                return [{
                    key: "system.bonuses.damage",
                    type: "add",
                    value: 2,
                    phase: "initial"
                }];
            } else if (this.key == "dodge") {
                return [{
                    key: "system.bonuses.dodge",
                    type: "add",
                    value: 1,
                    phase: "initial"
                }];
            } else if (this.key == "sig_init") {
                return [{
                    key: "system.bonuses.initiative",
                    type: "add",
                    value: 1,
                    phase: "initial"
                }, {
                    key: "system.bonuses.signature_uses",
                    type: "add",
                    value: 1,
                    phase: "initial"
                }];
            }
        }
        // No other types of effects actually require active effects
        return [];
    }

    prepareBaseData() {
        this.changes = this.#changes;
        this.phase = "initial";

        // Correct out of bounds key
        let kf = UpgradeEffectModel.keysFor(this.category);
        if (!kf.includes(this.key)) {
            this.key = kf[0];
        }

        this.localized_short = loc(`animon.upgrade.${this.category}.${this.key}.short`) ?? "UNKNOWN";
        this.localized_description = loc(`animon.upgrade.${this.category}.${this.key}.full`) ?? "UNKNOWN";
    }
}
