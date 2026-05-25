<script>
    import loc from "../../../../utils/localize";
    import { sortedObjectToArray } from "../../../../models/base.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import { sortedArrayToObject } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";

    let { actor, edit } = $props();

    let relationships = $derived(sortedObjectToArray(actor.system.relationship));

    // Add a new relationship
    function addRelationship() {
        actor.update({
            "system.relationship": sortedArrayToObject([
                ...relationships,
                {
                    _id: foundry.utils.randomID(),
                },
            ]),
        });
    }

    // Increment the relationship with _id
    function removeRelationship(_id) {
        actor.update({ [`system.relationship.${_id}`]: _del });
    }
</script>

<div class="inner-box relationship-box">
    <div class="header">
        <h2>{loc("animon.sheet.kid.relationship.title")}:</h2>
    </div>
    <div class="relationships">
        {#each relationships as relationship, i}
            <div class="relationship">
                <UpdateInput
                    doc={actor}
                    path="system.relationship.{relationship._id}.label"
                    size="1"
                ></UpdateInput>
            </div>
        {/each}
        <button onclick={(e) => [stop(e), addRelationship()]}>
            {loc("animon.sheet.kid.relationship.add")}
        </button>
    </div>
</div>

<style lang="scss" module>
    .relationship-box {
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

        .relationships {
            display: flex;
            flex-direction: column;

            .relationship {
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
