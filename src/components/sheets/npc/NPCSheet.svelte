<script>
    import { reactive, resizing } from "../../../utils/attach.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    import Select from "../../fields/Select.svelte";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte";
    import ElementalSelect from "../../fields/ElementalSelect.svelte";
    let { edit = true, context, app } = $props();

    let actor = $derived(app.actor);

    let type_options = ["human", "animon", "other"].map((id) => ({
        id,
        label: id,
    }));
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
</style>
