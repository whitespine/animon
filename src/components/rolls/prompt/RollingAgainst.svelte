<script lang="ts">
    import {slide} from "svelte/transition";
    import Portrait from "../../fields/Portrait.svelte";
    import type { RollerState } from "./roller_state.svelte";

    /**
     * @type {{state: RollerState}}
     */
    let { state }: { state: RollerState } = $props();
</script>

{#if state.opponents.length}
    <div transition:slide class="row even center">
        <span class="pseudo-label">Against:</span>
        {#each state.opponents as opponent (opponent.document._id)}
            {let doc = $derived(opponent.document)}
            <Portrait {doc} path="texture.src" edit={false} height="32px" width="32px"></Portrait>
        {/each}
    </div>
{/if}

<style lang="scss">
</style>
