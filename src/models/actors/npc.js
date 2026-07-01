import { SortField } from "../base.svelte";
import { ActorModel } from "./actor.svelte";
import { elementField, tierField } from "./actor.svelte";

const fields = foundry.data.fields;

export class NpcModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            type: new fields.StringField({choices: ["human", "animon", "other"]}),
            level: new fields.NumberField({initial: 1, min: 1, max: 10, integer: true}),

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

            weaknesses: new fields.StringField({required: true}),

            tier: tierField(),
            element: elementField(),
            classification: new fields.StringField({required: true}),
            personality: new fields.StringField({required: true}),
            motivation: new fields.StringField({required: true}),

            signature: new fields.SchemaField({
                name: new fields.StringField({required: true}),
                element: elementField(),
                rank: new fields.NumberField({integer: 1, min: 1, max: 4, initial: 1})
            }),

            vibes: new fields.StringField({ initial: "" }),
            notes: new fields.StringField({ initial: "" }),
        }
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.skill_score = 1 + Math.floor(this.level / 2);
        if(this.type === "human") {
            this.hp.max = 5 * this.level
        } else {
            this.hp.max = 6 + 6*this.level;
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