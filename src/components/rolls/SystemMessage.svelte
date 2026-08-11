<script lang="ts">
    import BasicTest from "./message/BasicTest.svelte";
    import ContestedTest from "./message/ContestedTest.svelte";
    let { message } = $props();
</script>

{#if message.type == "basic_test"}
    <BasicTest {message} />
{:else if message.type == "contested_test"}
    <ContestedTest {message} />
{:else}
    <div>
        Unsupported message type {message.type}
    </div>
{/if}