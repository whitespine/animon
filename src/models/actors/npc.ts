import type { NpcActor } from "../../documents/actor.svelte";
import { SortField } from "../base.svelte";
import { ActorModel, Element, Tier } from "./actor.svelte";
import { elementField, tierField } from "./actor.svelte";

export enum NpcType {
    Human = "human",
    Animon = "animon",
    Other = "other"
}
export const NPC_TYPES = Object.values(NpcType);

const fields = foundry.data.fields;
const defineNpcSchema = () => ({
    type: new fields.StringField({ choices: NPC_TYPES, initial: NpcType.Human }),
    level: new fields.NumberField({ initial: 1, min: 1, max: 10, integer: true }),

    // Aka stamina
    hp: new fields.SchemaField({
        value: new fields.NumberField({ initial: 99999, min: 0, integer: true }),
        max: new fields.NumberField({}) // Dummy field to trick foundry. Automatically set as 9 + bond level
    }),

    strengths: new fields.TypedObjectField(new fields.SchemaField({
        sort: new SortField(),
        name: new fields.StringField({ required: true }),
        rank: new fields.NumberField({ min: 1, max: 3, initial: 1 })
    })),

    weaknesses: new fields.StringField({ required: true }),

    tier: tierField(),
    element: elementField(),
    classification: new fields.StringField({ required: true }),
    personality: new fields.StringField({ required: true }),
    motivation: new fields.StringField({ required: true }),

    signature: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        element: elementField(),
        rank: new fields.NumberField({ integer: true, min: 1, max: 4, initial: 1 })
    }),

    vibes: new fields.StringField({ initial: "" }),
    notes: new fields.StringField({ initial: "" }),
});

interface BaseData {
    type: NpcType,
    level: number,
    hp: {
        value: number,
        max: number
    },

    strengths: Record<string, {
        sort: number,
        name: string,
        rank: number
    }>,

    weaknesses: string,

    tier: Tier,
    element: Element,
    classification: string,
    personality: string,
    motivation: string,

    signature: {
        name: string,
        element: Element,
        rank: number
    },
    vibes: string,
    notes: string
}

interface DerivedData {
    skill_score: number;
    dodge: number;
    initiative: number;
    damage: number;
}

type NpcSchema = ReturnType<typeof defineNpcSchema>;
export class NpcModel extends ActorModel<NpcSchema, NpcActor, BaseData, DerivedData> {
    static defineSchema() {
        return defineNpcSchema();
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.skill_score = 1 + Math.floor(this.level / 2);
        if (this.type === "human") {
            this.hp.max = 5 * this.level
        } else {
            this.hp.max = 6 + 6 * this.level;
        }
        this.dodge = this.skill_score;
        this.initiative = this.skill_score;
        this.damage = {
            "fledgling": this.level,
            "basic": this.level + 1,
            "super": this.level + 2,
            "ultra": this.level + 3,
            "giga": this.level + 4,
        }[this.tier];
    }
}