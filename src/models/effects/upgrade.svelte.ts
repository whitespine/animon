import type { InterfaceToObject } from "fvtt-types/utils";
import loc from "../../utils/localize";
import { baseEffectChanges } from "./base";

const fields = foundry.data.fields;

export enum Category {
    Minor = "minor",
    Major = "major",
    Score = "score"
}

const defineUpgradeEffectSchema = () => ({
    ...baseEffectChanges(),

    // We strictly limit category
    category: new fields.StringField({ choices: Object.values(Category) }),

    // Keys aren't strictly categorized, but some will have no effect
    // Should match localization keys
    key: new fields.StringField({ required: true }),

    // For player tracking of what they applied their upgrade to
    notes: new fields.StringField({ required: true }),

    // The level at which this was acquired. Used for warning against repeat choices, etc
    level: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
});

interface BaseData {
    category: Category,
    key: string,
    notes: string,
    level: number
}

interface DerivedData {
    changes: Array<any>, // who cares
    localized_short: string,
    localized_description: string
}

// These are generated dynamically by upgrade items
// export class UpgradeEffectModel extends foundry.data.ActiveEffectTypeDataModel {
type Schema = ReturnType<typeof defineUpgradeEffectSchema>;
export class UpgradeEffectModel extends foundry.abstract.TypeDataModel<Schema, ActiveEffect<"upgrade">, InterfaceToObject<BaseData>, InterfaceToObject<DerivedData>> {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return defineUpgradeEffectSchema();
    }

    static keysFor(category: Category) {
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

        // Correct out of bounds key
        let kf = UpgradeEffectModel.keysFor(this.category);
        if (!kf.includes(this.key)) {
            this.key = kf[0];
        }

        this.localized_short = loc(`animon.upgrade.${this.category}.${this.key}.short`) ?? "UNKNOWN";
        this.localized_description = loc(`animon.upgrade.${this.category}.${this.key}.full`) ?? "UNKNOWN";
    }
}
