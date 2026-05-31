<script>
    import loc from "../../../../utils/localize";
    import UpdateInput from "../../../fields/UpdateInput.svelte";

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
                <UpdateInput
                    doc={actor}
                    path="system.trait.{trait}"
                    style="text-align: center"
                    size="1"
                ></UpdateInput>
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
