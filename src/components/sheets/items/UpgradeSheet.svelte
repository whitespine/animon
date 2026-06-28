<script>
    import { reactive } from "../../../utils/attach.svelte";
    import { UpgradeModel } from "../../../models/items/upgrade.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    import Select from "../../fields/Select.svelte";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte";
    import loc from "../../../utils/localize";

    let { context, app } = $props();
    let upgrade = $derived(context.item);
    let edit = $derived(app.isEditable);

    let category_options = ["minor", "major", "score"].map((id) => ({
        id,
        label: loc(`animon.upgrade.${id}.title`),
    }));
    let key_options = $derived(
        UpgradeModel.keysFor(upgrade.system.category).map((id) => ({
            id,
            label: loc(`animon.upgrade.${upgrade.system.category}.${id}.short`),
        })),
    );
</script>

<div class="outer-box">
    <div class="inner-box row center contain">
        <Portrait
            width="156px"
            height="156px"
            class="inner-portrait"
            doc={upgrade}
            {edit}
        />
        <div class="col grow">
            <div class="prefix-input">
                <label for="name"> {loc("animon.upgrade.name")}: </label>
                <input {@attach reactive(upgrade, "name")} size="1" />
            </div>
            <div class="prefix-input even">
                <label for="system.level">
                    {loc("animon.upgrade.level")}:
                </label>
                <input
                    {@attach reactive(upgrade, "system.level")}
                    type="number"
                    size="1"
                />
            </div>
            <div class="prefix-input even">
                <label for="system.category">
                    {loc("animon.upgrade.category")}:
                </label>
                <Select
                    {@attach reactive(upgrade, "system.category")}
                    options={category_options}
                ></Select>
            </div>
            <div class="prefix-input even">
                <label for="system.category">
                    {loc("animon.upgrade.key")}:
                </label>
                <Select
                    {@attach reactive(upgrade, "system.key")}
                    options={key_options}
                ></Select>
            </div>
        </div>
    </div>
    <ProsemirrorField doc={upgrade} path="system.notes" style="height: 200px"
    ></ProsemirrorField>
</div>

<style lang="scss">
</style>
