import { NpcModel } from "./actors/npc";
import { KidModel } from "./actors/kid";
import { CombatModel, CombatantModel } from "./combat";
import { GearModel } from "./items/gear.svelte";

export function setupModels() {
    CONFIG.Actor.dataModels["kid"] = KidModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Item.dataModels["gear"] = GearModel;
    CONFIG.Combatant.dataModels["base"] = CombatantModel;
}