<script>
    import Boost from "./Boost.svelte";
    import { RollerState } from "./roller_state.svelte";
    import Incrementer from "../../fields/Incrementer.svelte";

    function roll() {}
</script>

<div class="col">
    <div class="row center">
        <label for="difficulty">Difficulty:</label>
        <Incrementer
            type="number"
            name="difficulty"
            min="1"
            bind:value={RollerState.difficulty}
        />
    </div>
    {#if RollerState.actor?.type === "kid"}
        <div class="row center">
            <label for="bond_points">Spend Bond Points:</label>
            <Incrementer
                type="number"
                name="bond_points"
                min="1"
                max={RollerState.actor?.system}
                bind:value={RollerState.difficulty}
            />
        </div>
    {/if}
    <Boost bind:value={RollerState.boost}></Boost>
    <button onclick={roll}>Roll</button>
</div>

<style lang="scss">
</style>
