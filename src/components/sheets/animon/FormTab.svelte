<script>
    import AnimonHeader from "./components/AnimonHeader.svelte";
    import Stats from "./components/Stats.svelte";

    let { actor, form_id, edit } = $props();
</script>

<div class="form">
    <AnimonHeader {actor} {edit}></AnimonHeader>
    <Stats {actor} {form_id} {edit}></Stats>
</div>

<style lang="scss" module>
</style>
