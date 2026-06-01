<script>
    import loc from "../../../../utils/localize";
    import { sortedObjectToArray } from "../../../../models/base.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import { sortedArrayToObject } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";
    import { slide } from "svelte/transition";

    let { actor, edit } = $props();

    let harms = $derived(sortedObjectToArray(actor.system.harm));

    let total_harm = $derived(harms.reduce((p, c) => p + c.severity, 0));
    let shaken = $derived(total_harm >= 3);

    // Add a new harm
    function addHarm() {
        actor.update({
            "system.harm": sortedArrayToObject([
                ...harms,
                {
                    _id: foundry.utils.randomID(),
                },
            ]),
        });
    }

    // Increment the harm with _id
    function incrementHarm(_id) {
        // TODO: If shaken, instead increase bond strain
        let existing = actor.system.harm[_id];
        if (!existing) return;
        actor.update({
            [`system.harm.${_id}.severity`]: existing.severity + 1,
        });
    }

    // Decrement the harm with _id. If it already is rank 1, delete it
    function decrementHarm(_id) {
        let existing = actor.system.harm[_id];
        if (!existing) return;
        if (existing.severity == 1) {
            actor.update({ [`system.harm.${_id}`]: _del });
        } else {
            actor.update({
                [`system.harm.${_id}.severity`]: existing.severity - 1,
            });
        }
    }
</script>

<div class="inner-box harm-box">
    <h2>
        <span>{loc("animon.sheet.kid.harm.title")}: {total_harm} / 3</span>
        {#if shaken}
            <span
                class="shaken"
                data-tooltip={loc("animon.sheet.kid.harm.shaken_tooltip")}
            >
                - {loc("animon.sheet.kid.harm.shaken")}
            </span>
        {:else}
            <a onclick={(e) => [stop(e), addHarm()]}>
                <i
                    class="fas fa-plus"
                    data-tooltip={loc("animon.sheet.kid.relationship.add")}
                ></i>
            </a>
        {/if}
    </h2>
    <div class="col">
        {#each harms as harm (harm._id)}
            <div
                class="harm prefix-input"
                style:height="{harm.severity * 1.5}rem"
                transition:slide
            >
                <label for="system.harm.{harm._id}.name">
                    Lv.{harm.severity}:
                </label>
                <UpdateInput
                    doc={actor}
                    path="system.harm.{harm._id}.name"
                    size="1"
                ></UpdateInput>
                <!--class={{ disabled: total_harm >= 3, foo: true }}-->
                <a
                    onclick={(e) => [stop(e), incrementHarm(harm._id)]}
                    class={{ disabled: total_harm >= 3 }}
                    data-tooltip={total_harm >= 3
                        ? loc("animon.sheet.kid.harm.shaken_overflow")
                        : undefined}
                >
                    <i class="fas fa-plus"></i>
                </a>
                <a onclick={(e) => [stop(e), decrementHarm(harm._id)]}>
                    {#if harm.severity > 1}
                        <i class="fas fa-minus"></i>
                    {:else}
                        <i class="fas fa-trash"></i>
                    {/if}
                </a>
            </div>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .harm {
        transition: height 0.5s;

        input {
            flex: 1 0;
        }
    }
</style>
