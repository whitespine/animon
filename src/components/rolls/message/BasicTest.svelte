<script lang="ts">
    import { suspense } from "../../../utils/suspense.svelte";
    import RollDisplay from "./RollDisplay.svelte";
    import type { BasicTestChatMessage } from "../../../documents/message.svelte";

    let { message }: { message: BasicTestChatMessage } = $props();

    let roll = $derived(message.rolls[0]);

    // Modify this roll to have a flipped doomcoin. DSN integrated
    async function pushRoll() {
        // Just reroll it
        let new_roll = await new Roll(roll.formula).roll();
        await game.messages.get(message.id!)?.update({
            rolls: [new_roll],
            system: {
                suspense: suspense(new_roll),
                pushed: true,
            },
        });
    }
</script>

<div class="animon">
    <div class="col">
        <RollDisplay
            {roll}
            suspense_id={message.system.suspense}
            contributors={message.system.params.contributors}
        >
            {#snippet vs()}
                <span>{message.system.params.difficulty}</span>
            {/snippet}
        </RollDisplay>

        {#if !message.system.pushed}
            <button
                data-tooltip="Pushing a roll rerolls it - but only once!"
                onclick={pushRoll}
            >
                Push!
            </button>
        {/if}
    </div>
</div>

<style lang="scss">
    .results {
        .dice.pushed {
            background-color: var(--color-warm-1);
            color: var(--color-cool-5);
        }

        p {
            font-size: x-large;
            font-weight: bold;
            padding-inline: 5px;
        }
    }
</style>
