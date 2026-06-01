import { SystemActor } from "../../documents/actor.svelte";
import { ActorModel } from "./actor.svelte";
import { sortedObjectToArray, SortField, titleCaseString } from "../base.svelte";

const fields = foundry.data.fields;

const statField = () => new fields.NumberField({ initial: 1, min: 1, integer: true });
export const ELEMENTS = [
    "neutral", "fire", "water", "nature", "electric", "earth", "wind", "light", "dark", "mirage"
];
const elementField = () => new fields.StringField({
    required: true, choices: ELEMENTS, initial: ELEMENTS[0]
});// TODO, choices or options?

export class AnimonModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // -- Link to its kid
            kid: new fields.ForeignDocumentField(SystemActor),

            // -- Nature tends to not change per form
            nature: new fields.StringField(),

            // -- Forms
            active_form_id: new fields.StringField({required: true}), // used to derive `form`, which can be null
            forms: new fields.TypedObjectField(new fields.SchemaField({
                // -- Classification
                sort: new SortField(), // Purely for display, doesn't affect evolution
                classification: new fields.StringField(),
                // elements: new fields.ArrayField(elementField()),
                element: elementField(),

                // Even if you're doing branched evolution, we need these tiers for stat calculation
                tier: new fields.StringField({ choices: ["fledgling", "basic", "super", "ultra", "giga"] }),

                // But if you are doing branched evolution, you probably want special names for it
                name: new fields.StringField(),

                // -- Form specific stats
                stats: new fields.SchemaField({
                    heart: statField(),
                    power: statField(),
                    agility: statField(),
                    brains: statField(),
                }),

                // -- Signature ability
                signature: new fields.SchemaField({
                    name: new fields.StringField(),
                    element: elementField(),
                    rank: new fields.NumberField({ min: 1, initial: 1, integer: true }),
                    effects: new fields.TypedObjectField(new fields.SchemaField({
                        name: new fields.StringField({ required: true })
                    }))
                }),

                // -- Capabilities
                qualities: new fields.TypedObjectField(new fields.SchemaField({
                    sort: new SortField(),
                    name: new fields.StringField({ required: true }),
                    rank: new fields.NumberField({ min: 1, max: 3, initial: 1, integer: true })
                })),
            })),

            // -- HP / Signature Uses
            hp: new fields.SchemaField({
                value: new fields.NumberField({ initial: 5, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. 
            }),
            signature_uses: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. 
            }),
        }
    }

    // Note to later self:  
    // we could theoretically do some tricky bullshit with $derived on a $state from a kid
    // to _theoretically_ make our derived attributes sidestep active effect procedures.
    // However, I don't really love that - svelte is nice and all but there comes a point of
    // deviance from foundry standard that might complicate later work

    /** Converts an animon tier to an arbitrary sortable integer
     * 
     * @param {string} tier The tier key
     * @returns {number}
     */
    static tierToInt(tier) {
        return AnimonModel.TIERS.indexOf(tier);
    }

    // We use these often enough...
    static TIERS = ["fledgling", "basic", "super", "ultra", "giga"];

    /** Convert a numeric tier into a key
     * 
     * @param {number} tier Tier result from tierToInt. out of bounds is capped to the bounds
     * @returns {"fledgling" | "basic" | "super" | "ultra" | "giga"} a tier key
     */
    static intToTier(tier) {
        if(tier >= 5) { // Super case
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

    formForTier(tier) {
        return this.sorted_forms.find(f => f.tier == tier);
    }

    prepareBaseData() {
        // Flatten and sort our forms
        this.sorted_forms = sortedObjectToArray(this.forms, (f) => [AnimonModel.tierToInt(f.tier), f.sort, f._id]);

        // For each form, establish their evolves_from and devolves_to
        // For the time being, assume all basics can become supers, etc
        for (let form of Object.values(this.forms)) {
            let next_level = AnimonModel.intToTier(AnimonModel.tierToInt(form.tier) + 1);
            let prev_level = AnimonModel.intToTier(AnimonModel.tierToInt(form.tier) - 1);
            form.evolves_to = Object.entries(this.forms).filter((k, v) => v.tier == next_level).map((k, v) => k);
            form.evolves_from = Object.entries(this.forms).filter((k, v) => v.tier == prev_level).map((k, v) => k);
            // Also give it a name if it lacks one
            form.name ||= `${this.parent.name} - ${titleCaseString(this.form?.tier ?? "Unknown")}`;
        }

        // Get our active form
        this.form = this.forms[this.active_form_id] ?? null;

        // Prepare our other fields based on it
        this.stats = {
            heart: 0,
            power: 0,
            agility: 0,
            brains: 0,
            damage: 0,
            dodge: 0,
            initiative: 0,
            ...(this.form?.stats ?? {})
        }
        this.stats.damage = {
            fledgling: this.stats.power,
            basic: 2 * this.stats.power,
            super: 2 * this.stats.power,
            ultra: 3 * this.stats.power,
            giga: 4 * this.stats.power,
        }[this.form?.tier] ?? 0;
        this.stats.dodge = this.stats.agility;
        this.stats.initiative = this.stats.brains;
        this.hp.max = {
            fledgling: 3 * this.stats.heart,
            basic: 3 * this.stats.heart + 5,
            super: 4 * this.stats.heart + 10,
            ultra: 5 * this.stats.heart + 15,
            giga: 6 * this.stats.heart + 20,
        }[this.form?.tier] ?? 0;
        this.signature_uses.max = this.stats.brains;

        // Initialize values for bonuses, maybe
        // These attributes will be further modified by effects, maybe?
    }

    async evolveTo(id, first_time = false) {
        if (!this.forms[id]) return;
        let base_changes = this.shiftChanges(id);
        let base_update = this.updateSource(this.shiftChanges(id));
        await base_update;
        if (first_time) {
            // TODO handle full heal on first_time. 
            // Easiest way would just be to perform two back to back updates
            let new_sys = this.parent.system; // Not us!
            new_sys.updateSource({
                "hp.value": new_sys.hp.max
            });
        }
    }

    async devolveTo(id) {
        if (!this.forms[id]) return;
        // TODO: handle de-evolution logic? There are some edge cases. Leave to player?
        this.updateSource(this.shiftChanges(id));
    }

    shiftChanges(id) {
        // Keep missing hp, but at most go down to 1 hp? But how how how do we predict...
    }

    // Get a form for the given tier
    formForTier(tier) {
        return all_forms.find((f) => f.tier == new_form_tier);
    }

    /** 
     * Model pre-create rules allow for setting initial values that go beyond the scope of
     * just what is allowed via the fields logic
     */
    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        // Put in the basics
        let mods = {};
        let active_form = data.active_form_id;
        if(!active_form) {
            active_form = foundry.utils.randomID();
            mods.active_form_id = active_form;
        }
        if(!data.forms?.[active_form]) {
            mods.forms = {};
            mods.forms[active_form] = {
                tier: "fledgling",
                name: "Just a baby <name it!>"
            }
        }
        this.updateSource(mods);
    }
}