<script>
    let { item, edit = false } = $props();
    import DeleteButton from "../fields/DeleteButton.svelte";
    import EditButton from "../fields/EditButton.svelte";
    import ViewButton from "../fields/ViewButton.svelte";
    import Portrait from "../fields/Portrait.svelte";
</script>

<div class="gear center row">
    <Portrait doc={item} {edit} height="48px" />
    <div class="body">
        <span>{item.name}</span>
    </div>
    {#if edit}
        <EditButton doc={item} />
        <DeleteButton doc={item} />
    {:else}
        <ViewButton doc={item} />
    {/if}
</div>

<style lang="scss">
    .gear {
        width: 100%;
        .body {
            flex: 1;
            height: 100%;

            p {
                margin: 0px;
            }
        }

        padding-right: 5px;
    }
</style>