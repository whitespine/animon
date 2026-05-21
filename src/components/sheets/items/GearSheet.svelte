<script>
    import Portrait from "../../fields/Portrait.svelte";
    import UpdateInput from "../../fields/UpdateInput.svelte";
    let { context, app } = $props();
    let gear = $derived(context.item);
    let edit = $derived(app.isEditable);
</script>

<div class="container">
    <div>
        <Portrait
            height="128px"
            style="margin-left: auto; margin-right: auto"
            doc={gear}
            {edit}
        />
    </div>
    <div>
        <UpdateInput doc={gear} path="name" />
    </div>
</div>

<style lang="scss">

.container {
    display: flex;
    flex-direction: row;
    align-items: center;
}

</style>
