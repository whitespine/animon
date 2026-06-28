<script>
    import { RollerState } from "./roller_state.svelte";
    import { stop } from "../../../utils/handlers";
</script>

<div class="row">
    <div class="row center even">

    </div>
    <div class="row center even">
        <label for="difficulty">Difficulty:</label>
        <Incrementer
            type="number"
            name="difficulty"
            min="1"
            bind:value={RollerState.difficulty}
        />
    </div>
    <div class="row center even">
        <label for="pool">Dice Pool:</label>
        <Incrementer
            type="number"
            name="pool"
            min="1"
            bind:value={RollerState.dice_pool}
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
