<script>
    import BasicRoll from "./BasicCheck.svelte";
    let { message } = $props();
</script>

{#if message.type == "basic_check"}
    <BasicRoll {message} />
{:else}
    <div>
        Unsupported message type {message.type}
    </div>
{/if}