import { NPCSheet, KidSheet, AnimonSheet } from "./ActorSheet";
import { GearSheet } from "./ItemSheet";
import { UpgradeSheet } from "./EffectSheet";
import loc from "../utils/localize";

type ADSC = typeof foundry.applications.api.DocumentSheetV2.AnyDocumentSheetConfig;
export function setupSheets() {
    const configs: Array<[
        any, 
        foundry.applications.apps.DocumentSheetConfig.AnyConstructor,
        foundry.applications.apps.DocumentSheetConfig.RegisterSheetOptions<any>
    ]> = [
        [Actor, NPCSheet, { types: ["npc"] }],
        [Actor, AnimonSheet, { types: ["animon"] }],
        [Actor, KidSheet, { types: ["kid"] }],
        [Item, GearSheet, { types: ["gear"] }],
        [ActiveEffect, UpgradeSheet, { types: ["upgrade"] }],
    ];

    for (let [doc, sheet, options] of configs) {
        foundry.applications.apps.DocumentSheetConfig.registerSheet(doc, game.system.id, sheet, {
            makeDefault: true,
            label: () => loc(`DOCUMENT.${doc.name}`),
            ...options,
        });
    }
}