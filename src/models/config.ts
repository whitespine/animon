import { NpcModel } from "./actors/npc";
import { KidModel } from "./actors/kid";
import { GearModel } from "./items/gear.svelte";
import { UpgradeEffectModel } from "./effects/upgrade.svelte";
import { NpcUpgradeEffectModel } from "./effects/npc_upgrade.svelte";
import { AnimonModel } from "./actors/animon";
import { BasicTestModel } from "./messages/basic_test";
import { ContestedTestModel } from "./messages/contested_test";

export function setupModels() {
    // @ts-ignore Why?
    CONFIG.Actor.dataModels["kid"] = KidModel;
    // @ts-ignore Why?
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Actor.dataModels["animon"] = AnimonModel;
    CONFIG.Item.dataModels["gear"] = GearModel;
    // CONFIG.Combatant.dataModels["base"] = CombatantModel;
    CONFIG.ActiveEffect.dataModels["upgrade"] = UpgradeEffectModel;
    CONFIG.ActiveEffect.dataModels["npc_upgrade"] = NpcUpgradeEffectModel;
    CONFIG.ChatMessage.dataModels["basic_test"] = BasicTestModel;
    CONFIG.ChatMessage.dataModels["contested_test"] = ContestedTestModel;
}