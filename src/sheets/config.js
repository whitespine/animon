import { NPCSheet, KidSheet, AnimonSheet } from "./ActorSheet";
import { GearSheet } from "./ItemSheet";
import { UpgradeSheet } from "./EffectSheet";

export function setupSheets() {
    const configs = [
        [Actor, NPCSheet, { types: ["npc"] }],
        [Actor, AnimonSheet, { types: ["animon"] }],
        [Actor, KidSheet, { types: ["kid"] }],
        [Item, GearSheet, { types: ["gear"] }],
        [ActiveEffect, UpgradeSheet, { types: ["upgrade"] }],
    ];

    for (let [doc, sheet, options] of configs) {
        foundry.applications.apps.DocumentSheetConfig.registerSheet(doc, game.system.id, sheet, {
            makeDefault: true,
            label: () => _loc("SHEETS.DefaultDocumentSheet", {
                document: _loc(`DOCUMENT.${doc.name}`)
            }),
            ...options,
        });
    }
}