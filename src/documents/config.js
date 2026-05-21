import { SystemChatMessage } from "../overrides/CustomChatMessage.svelte";
import { SystemActor } from "./actor.svelte";
import { SystemCombat, SystemCombatant } from "./combat";
import { SystemItem } from "./item.svelte";
import { SystemToken, SystemTokenDocument } from "./token";

export function setupDocuments() {
    CONFIG.Actor.documentClass = SystemActor;
    CONFIG.Item.documentClass = SystemItem;
    CONFIG.ChatMessage.documentClass = SystemChatMessage;
    CONFIG.Token.documentClass = SystemTokenDocument;
    CONFIG.Token.objectClass = SystemToken;
    CONFIG.Combat.documentClass = SystemCombat;
    CONFIG.Combatant.documentClass = SystemCombatant;

    CONFIG.Actor.trackableAttributes["player"] = {
        bar: ["hp"],
        value: ["power"]
    };
}