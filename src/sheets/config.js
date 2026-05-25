import { NPCSheet, KidSheet } from "./ActorSheet";
import { GearSheet } from "./ItemSheet";

export function setupSheets() {
    foundry.documents.collections.Actors.unregisterSheet("core", foundry.applications.sheets.ActorSheetV2);
    foundry.documents.collections.Actors.registerSheet(game.system.id, NPCSheet, { types: ["npc"], makeDefault: true });
    foundry.documents.collections.Actors.registerSheet(game.system.id, KidSheet, { types: ["kid"], makeDefault: true });
    foundry.documents.collections.Items.unregisterSheet("core", foundry.applications.sheets.ItemSheetV2);
    foundry.documents.collections.Items.registerSheet(game.system.id, GearSheet, { types: ["gear"], makeDefault: true });
}