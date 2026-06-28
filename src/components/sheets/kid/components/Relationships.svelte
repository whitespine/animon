<script>
    import loc from "../../../../utils/localize";
    import { sortedObjectToArray } from "../../../../models/base.svelte";
    
    import { sortedArrayToObject } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";
    import { slide } from "svelte/transition";

    let { actor, edit } = $props();

    let relationships = $derived(
        sortedObjectToArray(actor.system.relationship),
    );

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
    <h2 class="row">
        <span class="grow">
            {loc("animon.sheet.kid.relationship.title")}:
        </span>
        <a onclick={(e) => [stop(e), addRelationship()]}>
            <i
                class="fas fa-plus"
                data-tooltip={loc("animon.sheet.kid.relationship.add")}
            ></i>
        </a>
    </h2>
    <div class="col">
        {#each relationships as relationship, i (relationship._id)}
            <div class="prefix-input" transition:slide>
                <input {@attach reactive(actor, "system.relationship.{relationship._id}.name")} size="1"
                >
                <a
                    onclick={(e) => [
                        stop(e),
                        removeRelationship(relationship._id),
                    ]}
                >
                    <i class="fas fa-trash"></i>
                </a>
            </div>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .relationship-box {
        .header {
            a {
                margin-left: auto;
            }
        }
    }
</style>
