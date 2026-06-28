<script>
    import { reactive } from "../../../../utils/attach.svelte";
    import loc from "../../../utils/localize";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte";

    let { actor, edit } = $props();
</script>

<div class="notes outer-box">
    <h3>{loc("animon.sheet.tab.notes")}</h3>
    <div class="prefix-input">
        <label for="system.{key}">
            <Breaker text={loc(`animon.sheet.animon.nature}`)}></Breaker>:
        </label>
        <input {@attach reactive(actor, "system.nature")} size="1">
    </div>
    {#if edit}
        <ProsemirrorField doc={actor} path="system.notes" style="height: 800px"
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
