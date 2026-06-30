import { NpcModel } from "./actors/npc";
import { KidModel } from "./actors/kid";
import { CombatModel, CombatantModel } from "./combat";
import { GearModel } from "./items/gear.svelte";
import { UpgradeEffectModel } from "./effects/upgrade.svelte";
import { NpcUpgradeEffectModel } from "./effects/npc_upgrade.svelte";
import { AnimonModel } from "./actors/animon";
import { BasicTestModel } from "./messages/basic_test";

export function setupModels() {
    CONFIG.Actor.dataModels["kid"] = KidModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Actor.dataModels["animon"] = AnimonModel;
    CONFIG.Item.dataModels["gear"] = GearModel;
    CONFIG.Combatant.dataModels["base"] = CombatantModel;
    CONFIG.ActiveEffect.dataModels["upgrade"] = UpgradeEffectModel;
    CONFIG.ActiveEffect.dataModels["npc_upgrade"] = NpcUpgradeEffectModel;
    CONFIG.ChatMessage.dataModels["basic_test"] = BasicTestModel;
}