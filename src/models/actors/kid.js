import { ActorModel } from "./actor.svelte";

const fields = foundry.data.fields;

export class KidModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            player_name: new fields.StringField({ initial: "" }),
            // Biography - todo
            biography: new fields.HTMLField({ initial: "Put bio here" }),
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
    prepareDerivedData() {
        this.maximum_power = 10;
        this.gear_count = 0
        for(let item of this.parent.items.contents) {
            if(["gear"].includes(item.type)) {
                this.gear_count += 1
            }
        }
    }

}