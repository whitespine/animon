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
            kid: new fields.ForeignDocumentField(), // TODO flesh this out

            // -- Forms
            forms: new fields.TypedObjectField({
                // -- Classification
                sort: new fields.NumberField(), // Purely for display, doesn't affect evolution
                elements: new fields.ArrayField(elementField()),

                // -- Form specific stats
                stats: new fields.SchemaField({
                    heart: statField(),
                    power: statField(),
                    agility: statField(),
                    brains: statField(),
                    // damage, dodge, and initiative are derived
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

            // -- HP / 
            hp: new fields.SchemaField({
                value: new fields.NumberField({ initial: 5, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 9 + bond level
            }),
        }
    }

    /** 
     * Model pre-create rules allow for setting initial values that go beyond the scope of
     * just what is allowed via the fields logic
     */
    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        let mods = {
            power: 3 // Players should start with some power
        };

        // Put in the basics
        this.updateSource(mods);
    }

    // More complicated derivation logic might fit in better here than a $derived attribute (as seen in actor.svelte.js)
    // TODO: Figure ou
    prepareDerivedData() {
        this.maximum_power = 10;
        this.gear_count = 0
        for (let item of this.parent.items.contents) {
            if (["gear"].includes(item.type)) {
                this.gear_count += 1
            }
        }
    }

}