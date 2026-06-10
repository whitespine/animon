<script>
    import MainSig from "./MainSig.svelte";

    let { actor, edit, form_id } = $props();
</script>

<div class="inner-box signature-box">
    <MainSig {actor} {edit} {form_id}></MainSig>
    <span>TODO inherited signatures</span>
</div>

<style lang="scss" module>
    .signature-box {
    }
</style>
