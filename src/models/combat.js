import { ControlledLengthArrayField } from "./base.svelte";

export const fields = foundry.data.fields;

export class CombatModel extends foundry.abstract.TypeDataModel { 
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Currently set out action dice
            phase: new fields.StringField({
                initial: "begin",
                choices: ["begin", "set", "acts", "retreat", "end"]
            }),
            act: new fields.NumberField({ integer: true, min: 1, initial: 1, max: 6})
        };
    }
}

export class CombatantModel extends foundry.abstract.TypeDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Currently set out action dice
            set_dice: new fields.ArrayField(new fields.NumberField({
                integer: true,
                min: 1,
                initial: 1,
                max: 6
            })),

            // Current owned action dice. Can be lost or gained via resisting [death], initially just 2 for
            available_dice: new fields.NumberField({ integer: true, min: 1, initial: 2, max: 2 }), 
        };
    }

    async _preCreate(data, options, user) {
        this.updateSource({
            available_dice: this.parent.actor.system.base_action_dice
        });
    }
}