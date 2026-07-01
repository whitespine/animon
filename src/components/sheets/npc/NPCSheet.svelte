<script>
    import { reactive, resizing } from "../../../utils/attach.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    import Select from "../../fields/Select.svelte";
    import DeleteButton from "../../fields/DeleteButton.svelte";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte";
    import ElementalSelect from "../../fields/ElementalSelect.svelte";
    import { TIERS } from "../../../models/actors/actor.svelte";
    import { NPC_UPGRADES } from "../../../models/effects/npc_upgrade.svelte";
    import { stop } from "../../../utils/handlers";
    import { slide } from "svelte/transition";
    let { edit = true, context, app } = $props();

    let actor = $derived(app.actor);

    let type_options = ["human", "animon", "other"].map((id) => ({
        id,
        label: id,
    }));
    let stage_options = TIERS.map((id) => ({
        id,
        label: id,
    }));
    let upgrade_options = NPC_UPGRADES.map((u) => ({
        letter: u[0].toLocaleUpperCase(),
        category: u,
        tooltip: u,
    }));
    let upgrades = $derived(
        actor.system.sv_effects.filter((e) => e.type == "npc_upgrade"),
    );

    // Make or increment an upgrade
    function makeUpgrade(category) {
        let existing = actor.effects.find(
            (e) => e.type == "npc_upgrade" && e.system.category == category,
        );
        if (existing) {
            existing.update({
                "system.rank": existing.system.rank + 1,
            });
            return;
        }
        // Otherwise make a new one
        actor.createEmbeddedDocuments("ActiveEffect", [
            {
                name: "New Upgrade",
                type: "npc_upgrade",
                system: {
                    rank: 1,
                    category,
                },
            },
        ]);
    }
</script>

<div class="col inner-box contain">
    <div class="row">
        <Portrait
            doc={actor}
            {edit}
            class="top-inner-portrait"
            width="128px"
            height="128px"
        ></Portrait>
        <div class="col grow">
            <div class="row even">
                <div class="prefix-input">
                    <label for="name">Name:</label>
                    <input {@attach reactive(actor, "name")} size="1" />
                </div>
                <div class="prefix-input">
                    <label for="system.type">Type:</label>
                    <Select
                        {@attach reactive(actor, "system.type")}
                        options={type_options}
                        class="nude"
                    ></Select>
                </div>
            </div>
            <textarea
                {@attach reactive(actor, "system.vibes")}
                style:resize="none"
                placeholder="A brief description"
                class="nude grow"
            ></textarea>
            <div class="divider"></div>
        </div>
    </div>
    <div class="row even">
        <div class="prefix-input col start br">
            <label for="system.personality">Personality:</label>
            <textarea
                class="nude"
                {@attach reactive(actor, "system.personality")}
                {@attach resizing(() => actor.system.personality)}
                style:resize="none"
            ></textarea>
        </div>
        <div class="prefix-input col start">
            <label for="system.motivation">Motivation:</label>
            <textarea
                class="nude"
                {@attach reactive(actor, "system.motivation")}
                {@attach resizing(() => actor.system.motivation)}
            ></textarea>
        </div>
    </div>
    <div class="row even">
        <div class="prefix-input br">
            <label for="system.level">Level:</label>
            <input
                {@attach reactive(actor, "system.level")}
                size="1"
                type="number"
            />
        </div>
        <div class="prefix-input br">
            <span class="pseudo-label">Skill Score:</span>
            <span>{actor.system.skill_score}</span>
        </div>
        <div class="prefix-input br">
            <label for="system.hp.value"
                >{actor.system.type == "human" ? "Stamina" : "HP"}:</label
            >
            <input
                {@attach reactive(actor, "system.hp.value")}
                size="1"
                type="number"
            />
        </div>
        <div class="prefix-input br">
            <span class="pseudo-label">Init.:</span>
            <span>{actor.system.initiative}</span>
        </div>

        {#if actor.system.type != "human"}
            <div class="prefix-input br">
                <span class="pseudo-label">Damage:</span>
                <span>{actor.system.damage}</span>
            </div>
            <div class="prefix-input">
                <span class="pseudo-label">Dodge:</span>
                <span>{actor.system.dodge}</span>
            </div>
        {/if}
    </div>

    {#if actor.system.type != "human"}
        <div class="row even">
            <div class="br">
                <label for="system.tier">Stage:</label>
                <Select
                    class="nude"
                    options={stage_options}
                    {@attach reactive(actor, "system.tier")}
                ></Select>
            </div>
            <div class="grow-2 br">
                <div class="row center">
                    <span class="pseudo-label">Upgrades:</span>
                    {#each upgrade_options as uo}
                        <button
                            class="upgrade-button"
                            data-tooltip={uo.tooltip}
                            onclick={(e) => [stop(e), makeUpgrade(uo.category)]}
                        >
                            {uo.letter}
                        </button>
                    {/each}
                </div>
                <div class="upgrid">
                    {#each upgrades as upgrade (upgrade._id)}
                        <div transition:slide class="row center">
                            <span class="grow">
                                {upgrade.system.category}
                                {upgrade.system.rank}
                            </span>
                            <DeleteButton doc={upgrade}></DeleteButton>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="grow-2 br col">
                <label for="system.classification">Classification:</label>
                <input
                    class="nude grow"
                    size="1"
                    {@attach reactive(actor, "system.classification")}
                />
            </div>
            <div>
                <label for="system.element">Element:</label>
                <ElementalSelect
                    class="grow nude"
                    {@attach reactive(actor, "system.element")}
                ></ElementalSelect>
            </div>
        </div>
    {/if}
    <div class="divider"></div>
    <div class="row even">
        <div class="col grow-3 br">
            <span class="bold">Strengths:</span>
        </div>

        <div class="col br">
            <span class="bold">Weaknesses:</span>
            <textarea
                {@attach reactive(actor, "system.weaknesses")}
                {@attach resizing(() => actor.system.weaknesses)}
                style:resize="none"
                class="nude grow"
            ></textarea>
        </div>

        <div class="col grow-2">
            <span class="bold">Signature Attack:</span>
            <input
                {@attach reactive(actor, "system.signature.name")}
                placeholder="Unnamed"
                class="italic nude"
                size="1"
            />
            <div class="row center">
                <ElementalSelect
                    class="grow nude"
                    {@attach reactive(actor, "system.signature.element")}
                ></ElementalSelect>
                <span>Rank</span>
                <input
                    {@attach reactive(actor, "system.signature.rank")}
                    size="1"
                    class="nude"
                />
            </div>
        </div>
    </div>
    <div class="divider"></div>

    <h2>Special:</h2>
    <ProsemirrorField doc={actor} path="system.notes" style="height: 200px"
    ></ProsemirrorField>
</div>

<style lang="scss">
    .br {
        border-right: 1px solid black;
    }

    .upgrade-button {
        font-size: small;
        padding: 2px;
    }

    .upgrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    textarea {
        width: 100%;
    }
</style>
