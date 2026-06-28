<script>
    import loc from "../../../../utils/localize";
    import { sortedObjectToArray } from "../../../../models/base.svelte";

    import { sortedArrayToObject } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";
    import { slide } from "svelte/transition";
    import { reactive } from "../../../../utils/attach.svelte";

    let { actor, edit, form_id } = $props();

    // Qualities on this form specifically
    let prior_qualities = $derived.by(() => {
        let form = actor.system.forms[form_id];
        if (!form) return [];
        return form.prior_forms.flatMap((f) =>
            sortedObjectToArray(f.qualities),
        );
    });
    let this_qualities = $derived(
        sortedObjectToArray(actor.system.forms[form_id].qualities),
    );
    let combined_qualities = $derived([
        ...prior_qualities.map((quality) => ({
            editable: false,
            quality,
        })),
        ...this_qualities.map((quality) => ({
            editable: edit,
            quality,
        })),
    ]);

    // Todo: inherited qualities, for display only

    // Add a new quality
    function addQuality() {
        actor.update({
            [`system.forms.${form_id}.qualities`]: sortedArrayToObject([
                ...this_qualities,
                {
                    _id: foundry.utils.randomID(),
                },
            ]),
        });
    }

    // Remove the quality with _id
    function removeQuality(_id) {
        actor.update({ [`system.forms.${form_id}.qualities.${_id}`]: _del });
    }
</script>

<div class="inner-box quality-box">
    <div class="grid">
        <h2 class="title row">
            <span class="grow">{loc("animon.sheet.animon.quality.title")}:</span
            >
            <a onclick={(e) => [stop(e), addQuality()]}>
                <i
                    class="fas fa-plus"
                    data-tooltip={loc("animon.sheet.animon.quality.add")}
                ></i>
            </a>
        </h2>
        <h2 class="header-rank">{loc("animon.sheet.rank")}:</h2>
        <div></div>
        {#each combined_qualities as q (q.quality._id)}
            <div class="prefix-input name" transition:slide>
                {#if q.editable}
                    <input
                        {@attach reactive(
                            actor,
                            `system.forms.${form_id}.qualities.${q.quality._id}.name`,
                        )}
                        size="1"
                    />
                {:else}
                    <span>{q.quality.name}</span>
                {/if}
            </div>
            <div class="prefix-input rank" transition:slide>
                {#if q.editable}
                    <input
                        {@attach reactive(
                            actor,
                            `system.forms.${form_id}.qualities.${q.quality._id}.rank`,
                        )}
                        size="1"
                    />
                {:else}
                    <span>{q.quality.rank}</span>
                {/if}
            </div>
            <div transition:slide>
                {#if q.editable}
                    <a onclick={(e) => [stop(e), removeQuality(q.quality._id)]}>
                        <i class="fas fa-trash"></i>
                    </a>
                {/if}
            </div>
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

            div {
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
                background-color: inherit;
                color: black;
            }
            .rank {
                border-right: none !important;
            }
        }
    }
</style>
