<script lang="ts">
    import { randomNumber } from "../../utils/random";
    import Scrambler from "../layout/Scrambler.svelte";
    import Die from "./Die.svelte";
    let props = $props();
</script>

<Scrambler interval={50} generator={(prev) => randomNumber(1, 6, prev ?? 1)}>
    {#snippet content(value: number)}
        <Die {value} {...props} />
    {/snippet}
</Scrambler>
