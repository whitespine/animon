import { NpcModel } from "./actors/npc";
import { KidModel } from "./actors/kid";
import { CombatModel, CombatantModel } from "./combat";
import { GearModel } from "./items/gear.svelte";
import { UpgradeEffectModel } from "./effects/upgrade.svelte";
import { UpgradeModel } from "./items/upgrade.svelte";
import { AnimonModel } from "./actors/animon";
import { BasicTestModel } from "./messages/basic_test";

export function setupModels() {
    CONFIG.Actor.dataModels["kid"] = KidModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Actor.dataModels["animon"] = AnimonModel;
    CONFIG.Item.dataModels["gear"] = GearModel;
    CONFIG.Item.dataModels["upgrade"] = UpgradeModel;
    CONFIG.Combatant.dataModels["base"] = CombatantModel;
    CONFIG.ActiveEffect.dataModels["upgrade"] = UpgradeEffectModel;
    CONFIG.ChatMessage.dataModels["basic_test"] = BasicTestModel;
}