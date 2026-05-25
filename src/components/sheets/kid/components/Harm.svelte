<script>
    import loc from "../../../../utils/localize";
    import { sortedObjectToArray } from "../../../../models/base.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import { sortedArrayToObject } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";

    let { actor, edit } = $props();

    let harms = $derived(sortedObjectToArray(actor.system.harm));

    let shaken = $derived(harms.reduce((p, c) => p + c.severity, 0) >= 3);

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
        let existing = actor.system.harm[_id];
        if (!existing) return;
        actor.update({ [`system.harm.${_id}.harm`]: existing.harm + 1 });
    }

    // Decrement the harm with _id. If it already is rank 1, delete it
    function decrementHarm(_id) {
        let existing = actor.system.harm[_id];
        if (!existing) return;
        if (existing.severity == 1) {
            actor.update({ [`system.harm.${_id}`]: _del });
        } else {
            actor.update({ [`system.harm.${_id}.harm`]: existing.harm - 1 });
        }
    }
</script>

<div class="inner-box harm-box">
    <div class="header">
        <h2>{loc("animon.sheet.kid.harm.title")}:</h2>
        <div class="shaken">
            <h2>{loc("animon.sheet.kid.harm.shaken")}</h2>
        </div>
    </div>
    <div class="harms">
        {#each harms as harm, i}
            <div class="harm">
                <span>{i + 1}: </span>
                <UpdateInput
                    doc={actor}
                    path="system.harm.{harm._id}.label"
                    size="1"
                ></UpdateInput>
            </div>
        {/each}
        {#if !shaken}
            <button onclick={(e) => [stop(e), addHarm()]}>
                {loc("animon.sheet.kid.add_harm")}
            </button>
        {/if}
    </div>
</div>

<style lang="scss" module>
    .harm-box {
        .header {
            display: flex;
            flex-direction: row;
            align-items: center;

            h2 {
                flex: 0 1;
                margin: 0;
            }

            input,
            span {
                flex: 1 0;
                text-align: center;
            }
        }

        .harms {
            display: flex;
            flex-direction: column;

            .harm {
                display: flex;
                flex-direction: row;
                align-items: center;

                input {
                    flex: 1 0;
                }
            }
        }
    }
</style>
