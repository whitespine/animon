<script>
    import Die from "./Die.svelte";
    import RollingDie from "./RollingDie.svelte";
    import { formulaFor } from "../../utils/roll";
    import { suspense, inSuspense } from "../../utils/suspense.svelte";

    let { message } = $props();

    let roll_data = $derived(message.system);

    /** Reconstructed roll from the message
     * @type {Roll}
     */
    let roll = $derived(message.rolls[0]);

    /** The values on our d6's
     * @type {number[]}
     */
    let die_results = $derived(roll.dice[0].results);

    /** The sum total of + or - to the roll
     * @type {number}
     */
    let modifiers = $derived(roll.total - roll.dice[0].total); // Dumb hack, won't work in most cases

    // Modify this roll to have a flipped doomcoin. DSN integrated
    async function pushRoll() {
        // Just reroll it
        let roll = await new Roll(formulaFor(roll_data.params)).roll();
        await game.messages.get(message.id).update({
            rolls: [roll],
            system: {
                suspense: suspense(roll),
                pushed: true,
            },
        });
    }
</script>

<div class={{ animon: true, dice: true, row: true, pushed: roll_data.pushed }}>
    {#each die_results as die}
        {#if inSuspense(roll_data.suspense)}
            <RollingDie />
        {:else}
            <Die value={die.result} discarded={die.discarded} />
        {/if}
    {/each}
    <span>+</span>
    <span>{modifiers}</span>
    <span>→</span>
    <span class={["result", { rolling: inSuspense(roll_data.suspense) }]}>
        {roll.total}
    </span>
    {#if !roll_data.pushed}
        <button
            data-tooltip="Pushing a roll rerolls it - but only once!"
            onclick={pushRoll}
        >
            Push!
        </button>
    {/if}
</div>

<style lang="scss">
    .dice {
        &.pushed {
            background-color: var(--color-warm-1);
            color: var(--color-cool-5);
        }

        .rolling.result {
            opacity: 0%;
        }

        span {
            font-size: x-large;
            font-weight: bold;
            padding-inline: 5px;
        }
    }
</style>
