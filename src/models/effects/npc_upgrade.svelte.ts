import type { InterfaceToObject } from "fvtt-types/utils";
import { baseEffectChanges } from "./base";

const fields = foundry.data.fields;

export enum NpcUpgradeCategory {
    Aggressive = "aggressive",
    Defensive = "defensive",
    Tough = "tough",
    Swift = "swift"
}
export const NPC_UPGRADE_CATEGORIES = Object.values(NpcUpgradeCategory);

const defineNpcUpgradeEffectSchema = () => ({
    ...baseEffectChanges(),
    // We strictly limit category
    category: new fields.StringField({ choices: NPC_UPGRADE_CATEGORIES, initital: NpcUpgradeCategory.Aggressive }),
    rank: new fields.NumberField({integer: true, min: 1, max: 4, initial: 1})
});

interface BaseData {
    category: string,
    rank: number
}
interface DerivedData {
    changes: any[];
}

type Schema = ReturnType<typeof defineNpcUpgradeEffectSchema>;
export class NpcUpgradeEffectModel extends foundry.abstract.TypeDataModel<Schema, ActiveEffect<"npc_upgrade">, InterfaceToObject<BaseData>, InterfaceToObject<DerivedData>> {
    // Other schema fields are specific to a particular model
    static defineSchema() {
        return defineNpcUpgradeEffectSchema();
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
