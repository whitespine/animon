<script>
    import loc from "../../../utils/localize";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte"

    let { actor, edit } = $props();
</script>

<div class="notes inner-box">
    <h3>{loc("animon.sheet.tab.notes")}</h3>
    {#if edit}
        <ProsemirrorField doc={actor} path="system.notes"
        ></ProsemirrorField>
    {:else}
        {@html actor.system.biography}
    {/if}
</div>

<style lang="scss" module>
    .notes {
        padding: 8px;
    }
</style>
