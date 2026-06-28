<script>
    import Boost from "./Boost.svelte";
    import Incrementer from "../../fields/Incrementer.svelte";
    import { RollerState } from "./roller_state.svelte";
    import { stop } from "../../../utils/handlers";
    import Select from "../../fields/Select.svelte";
    import loc from "../../../utils/localize";
    import {sortedObjectToArray} from "../../../models/base.svelte";


    function roll(e) {
        stop(e);
        RollerState.roll();
    }

    let trait_options = $derived(["logic", "reflex", "spirit"].map(id => ({
                id,
                label: loc(`animon.sheet.kid.traits.${id}.name`)
            })));
    let talent_definite_options = $derived(sortedObjectToArray(RollerState.actor.system.talents).map(t => ({
                id: t._id,
                label: t.name 
            })));
    let talent_options = $derived([{id: "", label: "NONE"}, ...talent_definite_options]);
    let stat_options = $derived(["heart", "power", "agility", "brains"].map(id => ({
                id,
                label: loc(`animon.sheet.animon.stats.${id}.name`)
            })));
    let quality_definite_options = $derived(RollerState.actor.system.form?.all_qualities.map(q => ({
                id: q._id,
                label: q.name 
            })));
    let quality_options = $derived([{id: "", label: "NONE"}, ...quality_definite_options]);
</script>

<div class="prompt col">
    <div class="row center even"></div>
    <div class="row center even">
        <label for="difficulty">Difficulty:</label>
        <Incrementer
            type="number"
            name="difficulty"
            min="1"
            bind:value={RollerState.difficulty}
        />
    </div>

    {#if RollerState.actor?.type == "kid"}
        <div class="row center even">
            <label for="trait">Trait [{RollerState.trait_bonus}]:</label>
            <Select name="trait" bind:selected={RollerState.trait} options={trait_options}></Select>
        </div>
        <div class="row center even">
            <label for="talent">Talent [{RollerState.talent_bonus}]:</label>
            <Select name="talent" bind:selected={RollerState.talent_id} options={talent_options}></Select>
        </div>
    {:else if RollerState.actor?.type == "animon"}
        <div class="row center even">
            <label for="stat">Stat [{RollerState.stat_bonus}]:</label>
            <Select name="stat" bind:selected={RollerState.stat} options={stat_options}></Select>
        </div>
        <div class="row center even">
            <label for="quality">Quality [{RollerState.quality_bonus}]:</label>
            <Select name="quality" bind:selected={RollerState.quality_id} options={quality_options}></Select>
        </div>
    {/if}


    {#if RollerState.kid}
        <div class="row center even">
            <label for="bond_points">Bond Points [{RollerState.bond_points_bonus_dice}]:</label>
            <Incrementer
                type="number"
                name="bond_points"
                min="0"
                max={RollerState.kid?.system.bond_points.value ?? 0}
                bind:value={RollerState.bond_points_spent}
            />
        </div>
    {/if}

    <div class="row center even">
        {#if RollerState.actor}
            <label for="final_mod">Manual Mods:</label>
        {:else}
            <label for="final_mod">Dice Pool:</label>
        {/if}
        <Incrementer
            type="number"
            name="final_mod"
            bind:value={RollerState.final_mod}
        />
    </div>
    <Boost bind:value={RollerState.boost}></Boost>
    <button
        onclick={roll}
        class={{ disabled: RollerState.dice_pool == 0 }}
    >
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
