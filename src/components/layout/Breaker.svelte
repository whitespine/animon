<script>
    let { text } = $props();
    let words = $derived(text.split(/\s+/));
    $inspect(text, words);
</script>

{#each words as w, i}
    {w}
    {#if i < words.length - 1}
        <br />
    {/if}
{/each}