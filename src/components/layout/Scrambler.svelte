<script lang="ts" generics="GenVal">
    import {onMount, type Snippet} from "svelte";
    type ScramblerProps = {
        // Interval in milliseconds
        interval: number,
        // Generates input to our snippet
        generator: (previous: GenVal | null) => GenVal,
        // Our snippet to render
        content: Snippet<[GenVal]>
    };
    let { interval, generator, content }: ScramblerProps = $props();

    let value = $derived(generator(null));
    $effect(() => {
        let intervalHandle = setInterval(() => {
            value = generator(value);
        }, interval);
        return () => clearInterval(intervalHandle);
    });
</script>

{@render content(value)}