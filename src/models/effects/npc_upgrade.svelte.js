import loc from "../../utils/localize";

const fields = foundry.data.fields;

export class NpcUpgradeEffectModel extends foundry.data.ActiveEffectTypeDataModel {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return {
            ...super.defineSchema(), // We override `changes`, but its required
            // We strictly limit category
            category: new fields.StringField({ choices: ["aggressive", "defensive", "tough", "swift"] }),
        };
    }

    get #changes() {
        if (this.category == "hp") {
            return [{
                key: "system.bonuses.hp",
                type: "add",
                value: 5
            }];
        } else if (this.key == "damage") {
            [{
                key: "system.bonuses.damage",
                type: "add",
                value: 2
            }];
        } else if (this.key == "dodge") {
            return [{
                key: "system.bonuses.dodge",
                type: "add",
                value: 1
            }];
        } else if (this.key == "sig_init") {
            return [{
                key: "system.bonuses.initiative",
                type: "add",
                value: 1
            }, {
                key: "system.bonuses.signature_uses",
                type: "add",
                value: 1
            }];
        } else {
            return [];
        }
    }

    prepareBaseData() {
        this.changes = this.#changes;
        this.localized_short = loc(`animon.upgrade.${this.category}.${this.key}.short`) ?? "UNKNOWN";
        this.localized_description = loc(`animon.upgrade.${this.category}.${this.key}.full`) ?? "UNKNOWN";
    }
}
