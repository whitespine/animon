import type { AnimonActor, KidActor } from "../../documents/actor.svelte";
import { SortField } from "../base.svelte";
import { ActorModel } from "./actor.svelte";

const fields = foundry.data.fields;

const statField = () => new fields.NumberField({ initial: 2, min: 2, max: 4, integer: true });
const defineKidSchema = () => ({
    // -- Biographical details
    player_name: new fields.StringField({ required: true }),
    virtue: new fields.StringField({ required: true }),
    desire: new fields.StringField({ required: true }),
    flaw: new fields.StringField({ required: true }),

    notes: new fields.HTMLField(), // Though not in the character sheet, you can't scribble in the margins of HTML!

    // -- Special item(s?). As a one-of, easier to not track as an item
    special_item: new fields.StringField({ required: true }),
    special_item_used: new fields.BooleanField({ initial: false }),

    // -- Currency.
    currency: new fields.NumberField({ integer: true, min: 0 }),

    // -- Kid type and feature. As a one-of, easier to not track as an item for now
    kid_type: new fields.StringField({ required: true }),
    kid_type_feature: new fields.HTMLField({ required: true }),

    // -- Relationships
    relationships: new fields.TypedObjectField(new fields.SchemaField({
        sort: new SortField(),
        name: new fields.StringField({ required: true }),
        // Maye eventually have a details section. How to sanitize html on nested fields?
    })),

    // -- Roll bonuses
    trait: new fields.SchemaField({
        logic: statField(),
        reflex: statField(),
        spirit: statField()
    }),
    talents: new fields.TypedObjectField(new fields.SchemaField({
        sort: new SortField(),
        name: new fields.StringField({ required: true }),
        rank: new fields.NumberField({ min: 1, max: 5, initial: 1 })
    })),

    // -- Stamina / Harm
    stamina: new fields.SchemaField({
        value: new fields.NumberField({ initial: 10, min: 0, integer: true }),
        max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 9 + bond level
    }),
    harm: new fields.TypedObjectField(new fields.SchemaField({
        sort: new SortField(),
        name: new fields.StringField({ required: true }),
        severity: new fields.NumberField({ initial: 1, min: 1, max: 3, integer: true })
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
});

interface BaseData {
    player_name: string,
    virtue: string,
    desire: string,
    flaw: string,

    notes: string,

    special_item: string,
    special_item_uses: boolean,

    currency: number,

    kid_type: string,
    kid_type_feature: string,

    relationships: Record<string, {
        sort: number,
        name: number
    }>,

    trait: {
        logic: number,
        reflex: number,
        spirit: number
    },

    talents: Record<string, {
        sort: number,
        name: string,
        rank: number
    }>,

    stamina: {
        value: number,
        max: number
    },

    harm: Record<string, {
        sort: number,
        name: string,
        severity: number
    }>,

    bond_level: number,
    bond_points: {
        value: number,
        max: number
    },
    bond_strain: {
        value: number,
        max: number
    },
    xp: number,
    minor_advance_taken: boolean,
    major_advance_taken: boolean
}

interface DerivedData {
    mons: AnimonActor[],
    total_harm: number,
    shaken: boolean
}

type KidSchema = ReturnType<typeof defineKidSchema>;
export class KidModel extends ActorModel<KidSchema, KidActor, BaseData, DerivedData> {
    static defineSchema() {
        return defineKidSchema();
    }

    // More complicated derivation logic might fit in better here than a $derived attribute (as seen in actor.svelte.js)
    prepareBaseData() {
        super.prepareBaseData();

        // Compute maximums
        this.stamina.max = 9 + this.bond_level;
        this.bond_points.max = 5 + this.bond_level; // Minimum 6, goes up with level
        this.bond_strain.max = this.bond_points.max;

        // Harm / shaken
        this.total_harm = Object.values(this.harm).reduce((p, c) => p + c.severity, 0);
        this.shaken = this.total_harm >= 3;

        // Gather a list of active mons from game.actors
        this.mons = game.actors.contents.filter(a => {
            return a.type == "animon" && a._source.system.kid == this.parent._id;
        }) as unknown as AnimonActor[];
    }
}