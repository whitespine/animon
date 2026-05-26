const fields = foundry.data.fields;

// These are generated dynamically by upgrade items
export class UpgradeEffectModel extends foundry.data.ActiveEffectTypeDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        let base = super.defineSchema();
        return {
            ...base,
            
            // Is this an effect on a kid that should be passed down to their mons?
            // If its on a kid the answer is yes, if its on a mon then I guess it doesn't matter
            passdown: new fields.BooleanField({initial: true})
        };
    }
}
