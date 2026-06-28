<script>
    import loc from "../../../utils/localize";
    import { rankedSort } from "../../../models/base.svelte";
    import { UpgradeModel } from "../../../models/items/upgrade.svelte";
    import DeleteButton from "../../fields/DeleteButton.svelte";
    import EditButton from "../../fields/EditButton.svelte";
    import ViewButton from "../../fields/ViewButton.svelte";
    import { slide } from "svelte/transition";
    import { stop } from "../../../utils/handlers";
    import XP from "../bond/components/XP.svelte";

    let { actor, edit } = $props();
    let items = $derived(actor.system.sv_items);
    let upgrades = $derived.by(() => {
        let unsorted = items.filter((i) => i.type == "upgrade");
        return rankedSort(unsorted, (u) => [u.system.level, u.sort]);
    });

    async function createUpgrade(category) {
        await actor.createEmbeddedDocuments("Item", [
            {
                name: "New Upgrade",
                type: "upgrade",
                system: {
                    category,
                    key: UpgradeModel.keysFor(category)[0],
                    level: actor.system.bond_level,
                    notes: `Manually created`,
                },
            },
        ]);
    }
</script>

<div class="outer-box col">
    {#snippet upgrade(doc)}
        <div transition:slide class="upgrade row">
            <div class="col grow">
                <span class="description bold">
                    {doc.system.localized_short}
                </span>
                <span class="level">Level: {doc.system.level}</span>
                <div class="grow notes">
                    {@html doc.system.notes}
                </div>
            </div>
            <div class="col">
                {#if edit}
                    <EditButton {doc} />
                    <DeleteButton {doc} />
                {:else}
                    <ViewButton {doc} />
                {/if}
            </div>
        </div>
    {/snippet}

    {#snippet column(category)}
        {@const sub_upgrades = upgrades.filter(
            (u) => u.system.category == category,
        )}
        <div class="inner-box col">
            <h2>{loc(`animon.upgrade.${category}.title`)}</h2>
            {#each sub_upgrades as u (u._id)}
                {@render upgrade(u)}
            {/each}

            <button onclick={(e) => [stop(e), createUpgrade(category)]}
                >Create</button
            >
        </div>
    {/snippet}

    <div class="inner-box">
        <XP {actor} direction="row"></XP>
    </div>

    <div class="row even">
        {@render column("minor")}
        {@render column("major")}
        {@render column("score")}
    </div>
</div>

<style lang="scss" module>
    .notes {
        overflow: hidden;

        p {
            margin: 0px;
        }
    }

    .upgrade {
        border-radius: 4px;
        border: 1px solid black;
        margin: 4px 0px;
        padding: 4px;
    }
</style>
