<script>
    import { GlobalRollerState } from "./prompt/roller_state.svelte";
    import { stop } from "../../utils/handlers";
    import { slide } from "svelte/transition";
    import TestPrompt from "./prompt/TestPrompt.svelte";
    import { ControlState } from "../../utils/control.svelte";

    /**
     * Runs when they press the button at the bottom
     */
     function toggle(e) {
        stop(e);
        GlobalRollerState.visible = !GlobalRollerState.visible;
    }

    $effect(() => {
        GlobalRollerState.speaker = ControlState.speaker;
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="animon anchor">
    <div
        class={{
            root: true,
            col: true,
            contracted: !GlobalRollerState.visible,
            expanded: GlobalRollerState.visible,
            "inner-box": true
        }}
    >
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <h1 class="header" onclick={toggle}>Roll</h1>
        {#if GlobalRollerState.visible}
            <div transition:slide>
                <TestPrompt state={GlobalRollerState}></TestPrompt>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .anchor,
    .root {
        align-self: end;
    }

    .anchor {
        position: relative;
    }

    .header {
        cursor: pointer;
    }

    .root {
        // This is what keeps it where it ought to be!
        position: fixed;
        width: 250px;

        // Make it mostly on top of things, but not too ontop!
        z-index: calc(var(--z-index-ui) + 10);
        pointer-events: all;

        // Coloring and styling of the background
        border-radius: 10px 10px 0px 0px;

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
