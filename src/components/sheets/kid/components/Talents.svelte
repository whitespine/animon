<script>
    import loc from "../../../../utils/localize";
    import { sortedObjectToArray } from "../../../../models/base.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import { sortedArrayToObject } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";

    let { actor, edit } = $props();

    let talents = $derived(sortedObjectToArray(actor.system.talent));

    // Add a new talent
    function addTalent() {
        actor.update({
            "system.talent": sortedArrayToObject([
                ...talents,
                {
                    _id: foundry.utils.randomID(),
                },
            ]),
        });
    }

    // Remove the talent with _id
    function removeTalent(_id) {
        actor.update({ [`system.talent.${_id}`]: _del });
    }
</script>

<div class="inner-box talent-box">
    <div class="grid">
        <h2 class="title">{loc("animon.sheet.kid.talent.title")}:</h2>
        <h2 class="header-rank">{loc("animon.sheet.kid.talent.rank")}:</h2>
        {#each talents as talent, i}
            <UpdateInput
                doc={actor}
                class="name prefix-input"
                path="system.talent.{talent._id}.name"
                size="1"
            ></UpdateInput>
            <UpdateInput
                doc={actor}
                class="rank prefix-input"
                path="system.talent.{talent._id}.rank"
                size="1"
            ></UpdateInput>
        {/each}
    </div>
    <button onclick={(e) => [stop(e), addTalent()]}>
        {loc("animon.sheet.kid.talent.add")}
    </button>
</div>

<style lang="scss" module>
    .talent-box {
        .grid {
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: 1fr 60px;

            .title, .header-rank {
                border-bottom: 2px solid gray;
            }
            .title, .name {
                border-right: 2px solid gray;
            }
            .name, .rank {
                border-left: none !important;
                border-top: none !important;
                border-bottom: var(--dash-line);
                padding-left: 5px;
                padding-right: 5px;
                background-color: inherit;
                color: black;
                margin-bottom: 2px;
            }
            .rank {
                border-right: none !important;
            }
        }
    }
</style>
