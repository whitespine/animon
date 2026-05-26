
<script>
    import { stop } from "../../../utils/handlers";
    import loc from "../../../utils/localize";
    import ViewGear from "../../items/ViewGear.svelte";

    let { actor, edit } = $props();
    let items = $derived(actor.system.sv_items.filter(x => x.type != "upgrade"));
</script>

<div class="gear inner-box">
    <h2>{loc("animon.sheet.tab.gear")}</h2>
    {#each items as i}
        <ViewGear item={i} {edit}></ViewGear>
    {/each}
</div>

<style lang="scss">
    .gear {
        display: flex;
        flex-direction: column;
    }
</style>
