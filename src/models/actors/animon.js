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
            active_form_id: new fields.StringField({ required: true }), // used to derive `form`, which can be null
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
     * @param {string | numer} tier The tier key
     * @returns {number}
     */
    static tierAsInt(tier) {
        if (typeof tier == "string") {
            let r = this.TIERS.indexOf(tier)
            return r == -1 ? 0 : r;
        } else {
            if (tier > 5) return 5;
            if (tier < 0) return 0;
            if (!Number.isInteger(tier)) return 0;
            return tier;
        }
    }

    // We use these often enough...
    static TIERS = ["fledgling", "basic", "super", "ultra", "giga"];

    /** Convert a numeric tier into a key
     * 
     * @param {string | number} tier Tier result from tierAsInt. out of bounds is capped to the bounds. Strings are sterilized
     * @returns {"fledgling" | "basic" | "super" | "ultra" | "giga"} a tier key
     */
    static tierAsString(tier) {
        if (typeof tier == "string") {
            if (this.TIERS.includes(tier)) return tier;
            return this.TIERS[0];
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

    // Compute max hp with the given tier and bonuses
    /**
     * 
     * @param {string | number | undefined} tier 
     * @param {number | undefined} heart 
     * @returns {number}
     */
    static damage(tier, power) {
        power ??= 0;
        return {
            fledgling: power,
            basic: 2 * power,
            super: 2 * power,
            ultra: 3 * power,
            giga: 4 * power,
        }[AnimonModel.tierAsString(tier)] ?? 0;
    }
    /**
     * 
     * @param {string | number | undefined} tier 
     * @param {number | undefined} heart 
     * @returns {number}
     */
    static maxHp(tier, heart) {
        heart ??= 0;
        return {
            fledgling: 3 * heart,
            basic: 3 * heart + 5,
            super: 4 * heart + 10,
            ultra: 5 * heart + 15,
            giga: 6 * heart + 20,
        }[AnimonModel.tierAsString(tier)] ?? 0;
    }

    prepareBaseData() {
        // Flatten and sort our forms
        this.sorted_forms = sortedObjectToArray(this.forms, (f) => [AnimonModel.tierAsInt(f.tier), f.sort, f._id]);

        // For each form, establish their evolves_from and devolves_to
        // For the time being, assume all basics can become supers, etc
        for (let form of Object.values(this.forms)) {
            let next_level = AnimonModel.tierAsString(AnimonModel.tierAsInt(form.tier) + 1);
            let prev_level = AnimonModel.tierAsString(AnimonModel.tierAsInt(form.tier) - 1);
            form.evolves_to = Object.entries(this.forms).filter((k, v) => v.tier == next_level).map((k, v) => k);
            form.evolves_from = Object.entries(this.forms).filter((k, v) => v.tier == prev_level).map((k, v) => k);
            // Also give it a name if it lacks one
            form.name ||= `${this.parent.name} - ${titleCaseString(this.form?.tier ?? "Unknown")}`;
        }

        // Get our active form
        this.form = this.forms[this.active_form_id] ?? null;

        // Initialize our stats at zero values
        this.stats = {
            heart: 0,
            power: 0,
            agility: 0,
            brains: 0,
            ...(this.form?.stats ?? {})
        }

        // Initialize values for bonuses
        this.bonuses = {
            hp: 0,
            dodge: 0,
            damage: 0,
            initiative: 0,
            signature_uses: 0
        }
        // These attributes will be further modified by effects, maybe?
    }

    // Compute our final bonuses
    prepareDerivedData() {
        this.hp.max = AnimonModel.maxHp(this.form?.tier, this.stats.heart) + this.bonuses.hp;
        this.signature_uses.max = this.stats.brains + this.bonuses.signature_uses;
        this.stats.damage = AnimonModel.damage(this.form?.tier, this.stats.power) + this.bonuses.damage;
        this.stats.dodge = this.stats.agility + this.bonuses.dodge;
        this.stats.initiative = this.stats.agility + this.bonuses.initiative;
    }

    // Forces us to fledgling stage if we aren't in a valid form
    async ensureInitialized() {
        if (this.form) return; // We're fine
        await this.getOrCreateForm("fledgling", true);
    }

    // Get the most current system
    get #csys() {
        return this.parent.system;
    }

    async volveTo(id, full_restore = false) {
        if(!this.forms[id]) {
            let form = this.formForTier(id);
            if(!form) return;
            id = form._id;
        }
        await this.#csys.ensureInitialized();
        // let current_form = AnimonModel.tierAsInt(this.#csys.form.tier);
        // let new_form = AnimonModel.tierAsInt(this.forms[id].tier);
        let base_changes = this.#csys.shiftChanges(id);
        await this.parent.update(base_changes);
        if (full_restore) {
            ui.notifications.warn("Make sure to heal yourself to full!");
        }
    }

    /** A more aggressive form of formForTier that will update the document to have a
     * form of the given tier.
     * 
     * @param {string} tier The tier that we want
     * @param {boolean} set_current If we should set it as active
     * @returns {string} The appropriate tier id
     */
    async getOrCreateForm(tier, set_current=false) {
        let existing = this.formForTier(tier);
        if (existing) {
            if(set_current && this.active_form_id != existing._id) {
                await this.parent.update({"system.active_form_id": existing._id})
            }
            return existing._id;
        } else {
            // Make a new one
            let new_id = foundry.utils.randomID();
            let patch = {
                [`system.forms.${new_id}`]: {
                    name: `New ${tier} form`,
                    tier
                }
            };
            if(set_current) {
                patch["system.active_form_id"] = new_id
            }
            await this.parent.update(patch);
            return new_id;
        }
    }

    // Get the update block to shift to a form 
    shiftChanges(form_id) {
        if(!this.form) throw new Error("Cannot evolve from null form");
        if(!this.forms[form_id]) throw new Error("Form id does not exist");
        let new_form = this.forms[form_id];

        // HP delta. Kid bonuses are the same so ignored
        let delta_hp = AnimonModel.maxHp(new_form.tier, new_form.stats.heart) - AnimonModel.maxHp(this.form.tier, this.form.stats.heart);
        let new_hp = this.hp.value + delta_hp;
        if(this.hp.value > 0 && new_hp <= 0) {
            new_hp = 1;
        }

        // Sig Uses delta - keep "missing" amount
        let delta_sig = new_form.stats.brains - this.form.stats.brains;
        let new_sig = this.signature_uses.value + delta_sig;
        if(this.signature_uses.value > 0 && new_sig <= 0) {
            new_sig = 1;
        }

        // Nothing else needs to change
        return {
            "system.active_form_id": form_id,
            "system.hp.value": new_hp,
            "system.signature_uses.value": new_sig
        };
    }

    // Get a form for the given tier
    formForTier(tier) {
        tier = AnimonModel.tierAsString(tier);
        return this.sorted_forms.find((f) => f.tier == tier);
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
        if (!active_form) {
            active_form = foundry.utils.randomID();
            mods.active_form_id = active_form;
        }
        if (!data.forms?.[active_form]) {
            mods.forms = {};
            mods.forms[active_form] = {
                tier: "fledgling",
                name: "Just a baby <name it!>"
            }
        }
        this.updateSource(mods);
    }
}