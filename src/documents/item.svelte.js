/**
 * Our custom class for Items
 */
export class SystemItem extends Item {
    /* @override
     * This is the best place to overwrite "top level" properties like name 
     * and prototype token attributes. Otherwise, use models
     */
    async _preCreate(...[data, options, user]) {
        let spc = await super._preCreate(data, options, user);
        if(spc===false) return spc;

        let mods = {}

        // Save only if necessary
        if (Object.keys(mods).length > 0) {
            this.updateSource(mods);
        }
    }
}