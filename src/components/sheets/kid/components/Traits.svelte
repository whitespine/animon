<script>
    import loc from "../../../../utils/localize";
    import UpdateInput from "../../../fields/UpdateInput.svelte";

    let { actor, edit } = $props();
</script>

<div class="inner-box traits-box">
    <h2>{loc("animon.sheet.kid.traits.label")}</h2>
    <div class="traits">
        {#each ["logic", "reflex", "spirit"] as trait, i}
            <div class="trait">
                <label for="system.traits.{trait}">
                    {loc(`animon.sheet.kid.traits.${trait}.name`)}:
                </label>
                <UpdateInput
                    doc={actor}
                    path="system.trait.{trait}"
                    size="1"
                ></UpdateInput>
            </div>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .traits-box {
        text-align: center;

    }
    .traits {
        display: flex;
        flex-direction: row;

        .trait {
            min-width: 0px;
            flex: 1 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
</style>
