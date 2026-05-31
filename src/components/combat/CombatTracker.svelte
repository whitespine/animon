<script>
    let { context } = $props();
    let combat = $derived(context.combat);
</script>

<div class="combat-tracker col">
    {#if combat == null}
        <span>No current combat. Toggle combat on tokens to create one.</span>
    {:else}
        <h1>
            Wow! You're in combat!
        </h1>
    {/if}
</div>

<style lang="scss">
    .combat-tracker {
        background-color: white;
        color: black;
        padding: 5px;
    }
</style>
