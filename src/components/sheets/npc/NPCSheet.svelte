<script>
    import NPCViewSheet from "./NPCViewSheet.svelte";
    import NPCEditSheet from "./NPCEditSheet.svelte";
    let { edit = false, context, app } = $props();

    /*
     * The NPC sheet demonstrates adding an additional prop (edit)
     * and controlling it via vertical-dots menu item
     */
</script>

{#if edit}
    <NPCEditSheet {app} {context} />
{:else}
    <NPCViewSheet {app} {context} />
{/if}
