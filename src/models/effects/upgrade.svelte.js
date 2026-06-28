const fields = foundry.data.fields;

// These are generated dynamically by upgrade items
export class UpgradeEffectModel extends foundry.data.ActiveEffectTypeDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        let base = super.defineSchema();
        return {
            ...base,
        };
    }
}
