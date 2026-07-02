import type { EmptyObject, InterfaceToObject } from "fvtt-types/utils";
import type { SystemActor } from "../../documents/actor.svelte";

const fields = foundry.data.fields;
type AnyDocument = foundry.abstract.Document.Any;

export enum Element {
    Neutral = "neutral", 
    Fire = "fire", 
    Water = "water", 
    Nature = "nature", 
    Electric = "electrIc", 
    Earth = "earth", 
    Wind = "wind", 
    Light = "light", 
    Dark = "dark", 
    Mirage = "mirage"
}

export const ELEMENTS = Object.values(Element);

export const elementField = () => new fields.StringField({
    required: true, choices: ELEMENTS, initial: ELEMENTS[0]
});

export enum Tier {
    Fledgling = "fledgling", 
    Basic = "basic",
    Super = "super", 
    Ultra = "ultra", 
    Giga = "giga"
};

export const TIERS = Object.values(Tier);
export const tierField = () => new fields.StringField({
    required: true, choices: TIERS, initial: TIERS[0]
})

export const effectField = () => new fields.SchemaField({
    name: new fields.StringField({ required: true })
});

export class ActorModel<
    Schema extends foundry.data.fields.DataSchema, 
    Parent extends SystemActor,
    BaseData extends object = EmptyObject, 
    DerivedData extends object = EmptyObject> extends foundry.abstract.TypeDataModel<Schema, Parent, InterfaceToObject<BaseData>, InterfaceToObject<DerivedData>> {

    // Make reactive states for our items / effects
    _sv_parent = $state<null | SystemActor>(null);
    sv_items = $derived.by(() => {
        if (!this._sv_parent) return [];
        let items = Array.from(this._sv_parent.items.svelte.values());
        return items.sort((a, b) => a.sort - b.sort);
    });
    sv_effects = $derived.by(() => {
        if (!this._sv_parent) return [];
        let effects = Array.from(this._sv_parent.effects.svelte.values());
        return effects.sort((a, b) => a.sort - b.sort);
    });

    // For all actors we at least prepare a sorted reactive array in the form of sv_items
    prepareBaseData() {
        this._sv_parent = this.parent;
    }

    // Migrations - always a pain! This is run every time the document is updated. 
    // Keep it simple, and consider doing a more permanent migration as an update hook instead
    static migrateData(sourceData: any) {
        // Fix traits to be schema instead of + prefixed data
        if (sourceData.old_power && sourceData.power == null) {
            sourceData.power = sourceData.old_power;
        }
        return sourceData;
    }

    // Get the most current system
    get _csys() {
        return this.parent.system;
    }
}

/** Converts an animon tier to an arbitrary sortable integer.
 * Takes either a tier or an existing number
 */
export function tierAsInt(tier: Tier | number): number {
    if (typeof tier == "string") {
        let r = TIERS.indexOf(tier)
        return r == -1 ? 0 : r;
    } else {
        if (tier > 5) return 5;
        if (tier < 0) return 0;
        if (!Number.isInteger(tier)) return 0;
        return tier;
    }
}

/** Convert a numeric tier into a key
 * 
 * @param {Tier | number} tier Tier result from tierAsInt. out of bounds is capped to the bounds. Strings are sterilized
 * @returns {Tier} a tier key
 */
export function tierAsString(tier: string | number): Tier {
    if (typeof tier == "string") {
        if (TIERS.includes(tier as Tier)) return tier as Tier;
        return TIERS[0];
    } else {
        if (tier >= 5) { // Super case
            return Tier.Giga; // Error correction
        }
        return [
            Tier.Fledgling,
            Tier.Basic,
            Tier.Super,
            Tier.Ultra,
            Tier.Giga
        ][tier] ?? Tier.Fledgling;
    }
}