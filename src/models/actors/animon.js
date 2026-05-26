import { SystemActor } from "../../documents/actor.svelte";
import { ActorModel } from "./actor.svelte";

const fields = foundry.data.fields;

const statField = () => new fields.NumberField({ initial: 1, min: 1, integer: true });
export const ELEMENTS = [
    "neutral", "fire", "water", "nature", "electric", "earth", "wind", "light", "dark", "mirage"
];
const elementField = () => new fields.StringField({
    required: true, choices: ELEMENTS
});// TODO, choices or options?

export class AnimonModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // -- Link to its kid
            kid: new fields.ForeignDocumentField(SystemActor), 

            // -- Forms
            active_form_id: new fields.StringField(), // used to derive `form`, which can be null
            forms: new fields.TypedObjectField({
                // -- Classification
                sort: new fields.NumberField(), // Purely for display, doesn't affect evolution
                elements: new fields.ArrayField(elementField()),

                // Even if you're doing branched evolution, we need these tiers for stat calculation
                tier: new fields.StringField({choices: ["fledgling", "basic", "super", "ultra", "giga"]}),

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
                    rank: new fields.NumberField({ min: 1, initial: 1, integer: true}),
                    effects: new fields.TypedObjectField(new fields.SchemaField({
                        name: fields.StringField({required: true})
                    }))
                }),
                // TODO: uses - seem to be per stage, confirm

                // -- Capabilities
                qualities: new fields.TypedObjectField({
                    sort: new fields.NumberField(),
                    name: new fields.StringField({ required: true }),
                    rank: new fields.NumberField({ min: 1, max: 3, initial: 1, integer: true })
                }),
            }),

            // -- HP / Signature Uses
            hp: new fields.SchemaField({
                value: new fields.NumberField({ initial: 5, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 9 + bond level
            }),
            signature_uses: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 9 + bond level
            }),
        }
    }

    // Note to later self:  
    // we could theoretically do some tricky bullshit with $derived on a $state from a kid
    // to _theoretically_ make our derived attributes sidestep active effect procedures.
    // However, I don't really love that - svelte is nice and all but there comes a point of
    // deviance from foundry standard that might complicate later work

    prepareBaseData() {
        // Find our kid
        this.kid = game.actors.get(this.kid);

        // Get our active form
        this.form = this.forms[this.active_form_id] ?? null;
        this.form_name = this.form?.name ?? `${this.parent.name} - ${titleCaseString(this.form?.tier ?? "Unknown")}`;

        // Prepare our other fields based on it
        this.stats = {
            heart: this.form?.stats.heart ?? 0,
            power: this.form?.stats.power ?? 0,
            agility: this.form?.stats.agility ?? 0,
            brains: this.form?.stats.brains ?? 0,
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
        // These attributes will be further modified by effects
    }

    /** 
     * Model pre-create rules allow for setting initial values that go beyond the scope of
     * just what is allowed via the fields logic
     */
    async _preCreate(data, options, user) {
        // TODO: Pre-create with a fledgling and basic form?
        await super._preCreate(data, options, user);
        // Put in the basics
        // this.updateSource(mods);
    }
}