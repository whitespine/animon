const fields = foundry.data.fields;

export const ELEMENTS = [
    "neutral", "fire", "water", "nature", "electric", "earth", "wind", "light", "dark", "mirage"
];
export const elementField = () => new fields.StringField({
    required: true, choices: ELEMENTS, initial: ELEMENTS[0]
});// TODO, choices or options?
export const TIERS = ["fledgling", "basic", "super", "ultra", "giga"];
export const tierField = () => new fields.StringField({
    required: true, choices: TIERS, initial: TIERS[0]
})

export const effectField = () => new fields.SchemaField({
    name: new fields.StringField({ required: true })
});

export class ActorModel extends foundry.abstract.TypeDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // For the time being, nothing is shared
        };
    }


    // Derived bonuses can be created via svelte derived attributes,
    // or in the more traditional prepareData workflows
    // attack_bonus = $derived(Math.min(this.power, 5));
    // Having this here makes some greedily reactive components happier that its not initially null
    sv_items = $derived.by(() => {
        if(!this.#parent) return [];
        let items = Array.from(this.#parent.items.svelte.values());
        return items.sort((a, b) => a.sort - b.sort);
    });
    sv_effects = $derived.by(() => {
        if(!this.#parent) return [];
        let effects = Array.from(this.#parent.effects.svelte.values());
        return effects.sort((a, b) => a.sort - b.sort);
    });

    // For all actors we at least prepare a sorted reactive array in the form of sv_items
    prepareBaseData() {
        this.#parent = this.parent;
    }

    // Migrations - always a pain! This is run every time the document is updated. 
    // Keep it simple, and consider doing a more permanent migration as an update hook instead
    static migrateData(sourceData) {
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

/** Converts an animon tier to an arbitrary sortable integer
 * 
 * @param {string | numer} tier The tier key
 * @returns {number}
 */
export function tierAsInt(tier) {
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
 * @param {string | number} tier Tier result from tierAsInt. out of bounds is capped to the bounds. Strings are sterilized
 * @returns {"fledgling" | "basic" | "super" | "ultra" | "giga"} a tier key
 */
export function tierAsString(tier) {
    if (typeof tier == "string") {
        if (TIERS.includes(tier)) return tier;
        return TIERS[0];
    } else {
        if (tier >= 5) { // Super case
            return "giga"; // Error correction
        }
        return [
            "fledgling",
            "basic",
            "super",
            "ultra",
            "giga",
        ][tier] ?? "fledgling";
    }
}