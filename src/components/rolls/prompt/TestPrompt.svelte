<script>
    import Boost from "./Boost.svelte";
    import Incrementer from "../../fields/Incrementer.svelte";
    import { stop } from "../../../utils/handlers";
    import Select from "../../fields/Select.svelte";
    import loc from "../../../utils/localize";
    import { sortedObjectToArray } from "../../../models/base.svelte";
    import { RollerState } from "./roller_state.svelte";
    import RollingAs from "./RollingAs.svelte";

    /**
     * @type {{
     *  state: RollerState
     * }}
     */
    let { state } = $props();

    function roll(e) {
        stop(e);
        state.roll();
    }

    let trait_options = $derived(
        ["logic", "reflex", "spirit"].map((id) => ({
            id,
            label: loc(`animon.sheet.kid.traits.${id}.name`),
        })),
    );
    let talent_definite_options = $derived(
        sortedObjectToArray(state.actor.system.talents).map((t) => ({
            id: t._id,
            label: t.name,
        })),
    );
    let none = { id: "", label: "NONE" };
    let talent_options = $derived([none, ...talent_definite_options]);
    let stat_options = $derived(
        ["heart", "power", "agility", "brains"].map((id) => ({
            id,
            label: loc(`animon.sheet.animon.stats.${id}.name`),
        })),
    );
    let quality_definite_options = $derived(
        state.actor.system.form?.all_qualities.map((q) => ({
            id: q._id,
            label: q.name,
        })),
    );
    let quality_options = $derived([none, ...quality_definite_options]);
    let signature_definite_options = $derived.by(() => {
        if(!state.actor?.system.form) return [];
        let result = state.actor.system.form.prior_forms.map(f => ({
            id: f._id,
            label: f.signature.name
        }));
        result.push({
            id: state.actor.system.active_form_id,
            label: state.actor.system.form.signature.name
        })
        return result;
    });
    let signature_options = $derived([none, ...signature_definite_options]);
</script>

<div class="prompt col">
    <RollingAs {state}></RollingAs>
    <div class="row center even">
        <label for="difficulty">Difficulty:</label>
        <Incrementer
            type="number"
            name="difficulty"
            min="1"
            bind:value={state.difficulty}
        />
    </div>

    {#if state.actor?.type == "kid"}
        <div class="row center even">
            <label for="trait">Trait [{state.trait_bonus}]:</label>
            <Select
                name="trait"
                bind:selected={state.trait}
                options={trait_options}
            ></Select>
        </div>
        <div class="row center even">
            <label for="talent">Talent [{state.talent_bonus}]:</label>
            <Select
                name="talent"
                bind:selected={state.talent_id}
                options={talent_options}
            ></Select>
        </div>
    {:else if state.actor?.type == "animon"}
        <div class="row center even">
            <label for="stat">Stat [{state.stat_bonus}]:</label>
            <Select
                name="stat"
                bind:selected={state.stat}
                options={stat_options}
            ></Select>
        </div>
        <div class="row center even">
            <label for="quality">Quality [{state.quality_bonus}]:</label>
            <Select
                name="quality"
                bind:selected={state.quality_id}
                options={quality_options}
            ></Select>
        </div>
        <div class="row center even">
            <label for="signature">Signature [{state.signature_bonus}]:</label>
            <Select
                name="signature"
                bind:selected={state.signature_id}
                options={signature_options}
            ></Select>
        </div>
    {/if}

    {#if state.kid}
        <div class="row center even">
            <label for="bond_points"
                >Bond Points [{state.bond_points_bonus_dice}]:</label
            >
            <Incrementer
                type="number"
                name="bond_points"
                min="0"
                max={state.kid?.system.bond_points.value ?? 0}
                bind:value={state.bond_points_spent}
            />
        </div>
    {/if}

    <div class="row center even">
        {#if state.actor}
            <label for="final_mod">Manual Mods:</label>
        {:else}
            <label for="final_mod">Dice Pool:</label>
        {/if}
        <Incrementer
            type="number"
            name="final_mod"
            bind:value={state.final_mod}
        />
    </div>
    <Boost bind:value={state.boost}></Boost>
    <button onclick={roll} class={{ disabled: state.dice_pool == 0 }}>
        Roll
    </button>
</div>

<style lang="scss" module>
    .prompt {
        select {
            margin-top: 2px;
            margin-left: 16px;
        }
    }
</style>
