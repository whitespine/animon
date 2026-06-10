<script>
    import loc from "../../../../utils/localize";
    import { sortedObjectToArray } from "../../../../models/base.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import { sortedArrayToObject } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";
    import { slide } from "svelte/transition";

    let { actor, edit, form_id } = $props();

    // Qualities on this form specifically
    let qualities = $derived(actor.system.forms[form_id].qualities);

    // Todo: inherited qualities, for display only

    // Add a new quality
    function addQuality() {
        console.log(qualities);
        actor.update({
            [`system.forms.${form_id}.qualities`]: sortedArrayToObject([
                ...qualities,
                {
                    _id: foundry.utils.randomID(),
                },
            ]),
        });
    }

    // Remove the quality with _id
    function removeQuality(_id) {
        actor.update({ [`system.forms.${form_id}.${_id}`]: _del });
    }
</script>

<div class="inner-box quality-box">
    <div class="grid">
        <h2 class="title row">
            <span class="grow">{loc("animon.sheet.animon.quality.title")}:</span>
            <a onclick={(e) => [stop(e), addQuality()]} >
                <i
                    class="fas fa-plus"
                    data-tooltip={loc("animon.sheet.animon.quality.add")}
                ></i>
            </a>
        </h2>
        <h2 class="header-rank">{loc("animon.sheet.rank")}:</h2>
        <div></div>
        {#each qualities as quality, i (quality._id)}
            <div transition:slide>
                <UpdateInput
                    doc={actor}
                    class="name prefix-input"
                    path="system.forms.{form_id}.{quality._id}.name"
                    size="1"
                ></UpdateInput>
            </div>
            <div transition:slide>
                <UpdateInput
                    doc={actor}
                    class="rank prefix-input"
                    path="system.forms.{form_id}.{quality._id}.rank"
                    size="1"
                ></UpdateInput>
            </div>
            <a
                onclick={(e) => [stop(e), removeQuality(quality._id)]}
                transition:slide
            >
                <i class="fas fa-trash"></i>
            </a>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .quality-box {
        .grid {
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: 1fr 60px 30px;
            align-items: center;

            div input {
                width: 100%;
                height: 100%;
            }

            .title,
            .header-rank {
                border-bottom: 2px solid gray;
            }
            .title,
            .name {
                border-right: 2px solid gray;
            }
            .name,
            .rank {
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
