<script>
    import { reactive } from "../../../../utils/attach.svelte";
    import loc from "../../../../utils/localize";
    

    let { actor, edit } = $props();
</script>

<div class="inner-box traits-box">
    <h2>{loc("animon.sheet.kid.traits.title")}</h2>
    <div class="traits row even center">
        {#each ["logic", "reflex", "spirit"] as trait, i}
            <div class="trait col center">
                <label for="system.traits.{trait}">
                    {loc(`animon.sheet.kid.traits.${trait}.name`)}:
                </label>
                <input {@attach reactive(actor, `system.trait.${trait}`)} style="text-align: center" size="1"
                >
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .traits-box {
        text-align: center;
    }

    .trait:not(:last-child) {
        border-right: var(--dash-line);
    }
</style>
