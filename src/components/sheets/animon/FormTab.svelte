<script>
    import AnimonFormHeader from "./components/AnimonFormHeader.svelte";
    import AnimonHeader from "./components/AnimonHeader.svelte";
    import Qualities from "./components/Qualities.svelte";
    import SignatureMoves from "./components/SignatureMoves.svelte";
    import Stats from "./components/Stats.svelte";
    import SubStats from "./components/SubStats.svelte";

    let { actor, form_id, edit } = $props();
</script>

<div class="grow col">
    <AnimonFormHeader {actor} {form_id} {edit}></AnimonFormHeader>
    <div class="row">
        <Stats {actor} {form_id} {edit}></Stats>
        <SubStats {actor} {form_id} {edit}></SubStats>
        <div class="grow col">
            <Qualities {actor} {form_id} {edit}></Qualities>
            <SignatureMoves {actor} {form_id} {edit}></SignatureMoves>
        </div>
    </div>
</div>

<style lang="scss" module>
</style>
