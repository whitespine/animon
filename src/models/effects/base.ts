const fields = foundry.data.fields;

export function baseEffectChanges() {
    // export class UpgradeEffectModel extends foundry.data.ActiveEffectTypeDataModel {
    return {
        changes: new fields.ArrayField(new fields.SchemaField({
            type: new fields.StringField(),
            phase: new fields.StringField(),
        }))
    };
}