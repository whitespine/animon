<script>
    import {slide} from "svelte/transition";
    import { stop } from "../../../utils/handlers";
    import loc from "../../../utils/localize";
    import ViewGear from "../../items/ViewGear.svelte";

    let { actor, edit } = $props();
    let gear = $derived(
        actor.system.sv_items.filter((x) => x.type == "gear"),
    );
    let anitool_upgrades = $derived(
        actor.system.sv_items.filter((x) => x.type == "anitool-upgrade"),
    );
</script>

<div class="outer-box even">
    <div class="inner-box">
        <h2>{loc("animon.sheet.tab.gear")}</h2>
        {#each gear as i (i._id)}
            <div class="gear" transition:slide>
                <ViewGear item={i} {edit}></ViewGear>
            </div>
        {/each}
    </div>

    <div class="inner-box">
        <h2>{loc("animon.sheet.gear.anitool")}</h2>
        {#each items as i (i._id)}
            <div class="gear" transition:slide>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .gear:not(:last-child) {
        border-bottom: var(--dash-line);
    }
</style>
