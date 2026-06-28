<script>
    import Portrait from "../../fields/Portrait.svelte";
    import UpdateInput from "../../fields/UpdateInput.svelte";
    let { context, app } = $props();
    let upgrade = $derived(context.item);
    let edit = $derived(app.isEditable);
</script>

<div class="col">
    <div class="row center even">
        <div>
            <Portrait
                height="128px"
                style="margin-left: auto; margin-right: auto"
                doc={gear}
                {edit}
            />
        </div>
        <div class="col">
            <div class="prefix-input">
                <label for="name"> {loc("animon.sheet.upgrade.name")}: </label>
                <UpdateInput doc={upgrade} path="name" size="1"></UpdateInput>
            </div>
            <div class="prefix-input">
                <label for="system.type"> {loc("animon.sheet.upgrade.type")}: </label>
                <UpdateSelect doc={upgrade} path="system.type" size="1"></UpdateInput>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
</style>
