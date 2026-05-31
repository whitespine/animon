<script>
    import BondBox from "../bond/BondBox.svelte"
    let { actor, edit } = $props();
</script>

<div class="mon">
    <BondBox kid={actor} {edit}></BondBox>
</div>

<style lang="scss" module>
    .mon {
    }
</style>
