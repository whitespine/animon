import { NpcModel } from "./actors/npc";
import { PlayerModel } from "./actors/player";
import { CombatModel, CombatantModel } from "./combat";
import { GearModel } from "./items/gear.svelte";

export function setupModels() {
    CONFIG.Actor.dataModels["player"] = PlayerModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Item.dataModels["gear"] = GearModel;
    CONFIG.Combatant.dataModels["base"] = CombatantModel;
}