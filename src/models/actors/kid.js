import { sortedObjectToArray, SortField } from "../base.svelte";
import { ActorModel } from "./actor.svelte";

const fields = foundry.data.fields;

const statField = () => new fields.NumberField({ initial: 2, min: 2, max: 4, integer: true });

export class KidModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // -- Biographical details
            player_name: new fields.StringField({}),
            virtue: new fields.StringField(),
            desire: new fields.StringField(),
            flaw: new fields.StringField(),

            notes: new fields.HTMLField(), // Though not in the character sheet, you can't scribble in the margins of HTML!

            // -- Special item(s?). As a one-of, easier to not track as an item
            special_item: new fields.StringField(),
            special_item_used: new fields.BooleanField({initial: false}),

            // -- Currency.
            currency: new fields.NumberField({integer: true, min: 0}),

            // -- Kid type and feature. As a one-of, easier to not track as an item for now
            kid_type: new fields.StringField(),
            kid_type_feature: new fields.HTMLField({}),

            // -- Relationships
            relationship: new fields.TypedObjectField(new fields.SchemaField({
                sort: new SortField(),
                name: new fields.StringField({required: true}),
                // Maye eventually have a details section. How to sanitize html on nested fields?
            })),

            // -- Roll bonuses
            trait: new fields.SchemaField({
                logic: statField(),
                reflex: statField(),
                spirit: statField()
            }),
            talent: new fields.TypedObjectField(new fields.SchemaField({
                sort: new SortField(),
                name: new fields.StringField({required: true}),
                rank: new fields.NumberField({min: 1, max: 5, initial: 1})
            })),

            // -- Stamina / Harm
            stamina: new fields.SchemaField({
                value: new fields.NumberField({ initial: 10, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 9 + bond level
            }),
            harm: new fields.TypedObjectField(new fields.SchemaField({
                sort: new SortField(),
                name: new fields.StringField(),
                severity: new fields.NumberField({initial: 1, min: 1, max: 3, integer: true})
            })), // Todo verify syntax

            // -- Bond
            bond_level: new fields.NumberField({ initial: 1, max: 10, integer: true }),
            bond_points: new fields.SchemaField({
                value: new fields.NumberField({ initial: 6, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 5 + bond level
            }),
            bond_strain: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 5 + bond level
            }),

            // -- Progression
            xp: new fields.NumberField({ initial: 0, min: 0, max: 10, integer: true }),
            minor_advance_taken: new fields.BooleanField({ initial: false }),
            // Advances + Score Improvements are tracked as an item that supplies an active effect (TODO)
        }
    }

    /** 
     * Model pre-create rules allow for setting initial values that go beyond the scope of
     * just what is allowed via the fields logic
     */
    // async _preCreate(data, options, user) {
        // await super._preCreate(data, options, user);

        // let mods = {
            // power: 3 // Players should start with some power
        // };

        // Put in the basics
        // this.updateSource(mods);
    // }
    _onUpdate(changed, options, userId) {
        if(userId == game.user.id && !this.parent.isToken) {
            console.log("TODO: update all linked animon");
            // Determine when this is run - after prepareBaseData? on item changes?
        }
    }


    // More complicated derivation logic might fit in better here than a $derived attribute (as seen in actor.svelte.js)
    prepareBaseData() {
        super.prepareBaseData();

        // Compute maximums
        this.stamina.max = 9 + this.bond_level;
        this.bond_points.max = 5 + this.bond_level; // Minimum 6, goes up with level
        this.bond_strain.max = this.bond_points.max;

        // Harm / shaken
        this.total_harm = Object.values(this.harm).reduce((p, c) => p + c, 0);
        this.shaken = this.total_harm >= 3;

        // Gather a list of active mons from game.actors
        let uuid = this.uuid;
        this.mons = game.actors.contents.filter(a => {
            return a.type == "animon" && a._source.system.kid == this.id;
        });

        // Sort our upgrades by level and then rank
        
       // TODO: is this re-run any time items are added? Does the above need to go in $state?
    }


    // prepareDerivedData() { }
    // applied after active effects
    // We might need some more phases. Look at ActiveEffect.implementation.CHANGE_PHASES

    // TODO: Reactive / effect logic to keep all animon up to date with
    // SPECIFICALLY passdown values. Use an active effect, probably, like in lancer
}