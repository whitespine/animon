import loc from "../../utils/localize";

const fields = foundry.data.fields;

export const NPC_UPGRADES = ["aggressive", "defensive", "tough", "swift"];

export class NpcUpgradeEffectModel extends foundry.data.ActiveEffectTypeDataModel {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return {
            ...super.defineSchema(), // We override `changes`, but its required
            // We strictly limit category
            category: new fields.StringField({ choices: NPC_UPGRADES }),
            rank: new fields.NumberField({integer: true, min: 1, max: 4, initial: 1})
        };
    }

    get #changes() {
        console.log("IS IT WORKING");
        if (this.category == "tough") {
            return [{
                key: "system.hp.max",
                type: "add",
                value: 10 * this.rank,
                phase: "initial"
            }];
        } else if (this.category == "aggressive") {
            return [{
                key: "system.damage",
                type: "add",
                value: 2 * this.rank,
                phase: "initial"
            }];
        } else if (this.category == "defensive") {
            return [{
                key: "system.dodge",
                type: "add",
                value: 1 * this.rank,
                phase: "initial"
            }];
        } else if (this.category == "swift") {
            return [{
                key: "system.initiative",
                type: "add",
                value: 1 * this.rank,
                phase: "initial"
            }];
        } else {
            return [];
        }
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.changes = this.#changes;
    }
}
