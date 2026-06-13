<script>
    import { formulaFor, rollCheck } from "../../utils/roll";
    import Incrementer from "../fields/Incrementer.svelte";
    import { RollerState } from "./roller_state.svelte";
    import { stop } from "../../utils/handlers";
    import { slide } from "svelte/transition";

    /**
     * Runs when they press the button at the bottom
     */
    // Roll handler
    async function roll(mode) {
        RollerState.params.mode = mode;
        rollCheck(RollerState.params);
    }

    function toggle(e) {
        stop(e);
        RollerState.visible = !RollerState.visible;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="animon anchor">
    <div
        class={{
            root: true,
            col: true,
            contracted: !RollerState.visible,
            expanded: RollerState.visible,
        }}
        onclick={toggle}
    >
        <h1 onclick={toggle}>Roll</h1>
        {#if RollerState.visible}
            <div transition:slide>
                <div class="difficulty row center">
                    <span>Difficulty:</span>
                    <Incrementer
                        type="number"
                        name="difficulty"
                        min="0"
                        bind:value={RollerState.params.difficulty}
                    />
                </div>
                <div class="bonus row center">
                    <span>Bonus:</span>
                    <Incrementer
                        type="number"
                        name="bonus"
                        min="0"
                        bind:value={RollerState.params.bonus}
                    />
                </div>
                <div class="even row">
                    <button onclick={(e) => [stop(e), roll("disadvantage")]}>
                        Disadvantage
                    </button>
                    <button onclick={(e) => [stop(e), roll("standard")]}> Standard </button>
                    <button onclick={(e) => [stop(e), roll("advantage")]}>
                        Advantage
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .anchor, .root {
        align-self: end;
    }

    .anchor {
        position: relative;
    }

    .root {
        // This is what keeps it where it ought to be!
        position: fixed;
        width: 350px;

        // Make it mostly on top of things, but not too ontop!
        z-index: calc(var(--z-index-ui) + 10);
        pointer-events: all;

        // Coloring and styling of the background
        background-color: var(--slot-color);
        border-radius: 10px 10px 0px 0px;
        padding: 5px;

        transition: all;
        bottom: 1px;
        &.expanded {
            z-index: calc(var(--z-index-ui) + 1000);
        }

        &.contracted {
            cursor: pointer;
        }
    }
</style>
