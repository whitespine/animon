<script lang="ts">
    import { rollScrambler } from "../../utils/attach.svelte";
    import Die from "./Die.svelte";
    let props = $props();
</script>

<Die {@attach rollScrambler(50, 6)} {...props} />
