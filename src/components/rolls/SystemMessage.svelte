<script>
    import BasicTest from "./message/BasicTest.svelte";
    let { message } = $props();
</script>

{#if message.type == "basic_test"}
    <BasicTest {message} />
{:else}
    <div>
        Unsupported message type {message.type}
    </div>
{/if}