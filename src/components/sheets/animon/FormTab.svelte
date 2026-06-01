<script>
    import AnimonFormHeader from "./components/AnimonFormHeader.svelte";
import AnimonHeader from "./components/AnimonHeader.svelte";
    import Stats from "./components/Stats.svelte";

    let { actor, form_id, edit } = $props();
</script>

<div class="grow col">
    <AnimonFormHeader {actor} {form_id} {edit}></AnimonFormHeader>
    <div class="row">
        <Stats {actor} {form_id} {edit}></Stats>
    </div>
</div>

<style lang="scss" module>
</style>
