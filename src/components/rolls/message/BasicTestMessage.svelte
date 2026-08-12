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
    <h2>Test - {message.speakerActor?.name ?? "???"}</h2>
    <div class="col">
        <RollDisplay
            {roll}
            suspense_id={message.system.suspense}
            contributors={message.system.params.contributors}
            pushed={message.system.pushed}
        >
            {#snippet result(val)}
                <span class="result">{val} vs. {message.system.params.difficulty}</span>
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
    .result {
        font-size: x-large;
        font-weight: bold;
        padding-inline: 5px;
    }
</style>
