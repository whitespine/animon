<script>
    import Die from "../Die.svelte";
    import RollingDie from "../RollingDie.svelte";
    import { suspense, inSuspense } from "../../../utils/suspense.svelte";
    import { fixClasses } from "../../../utils/classes";
    import { rollScrambler } from "../../../utils/attach";

    let { message } = $props();

    /** Reconstructed roll from the message
     * @type {Roll}
     */
    let roll = $derived(message.rolls[0]);

    /** The values on our d6's
     * @type {number[]}
     */
    let die_results = $derived(roll.dice[0].results);

    // Modify this roll to have a flipped doomcoin. DSN integrated
    async function pushRoll() {
        // Just reroll it
        let new_roll = await new Roll(roll.formula).roll();
        await game.messages.get(message.id).update({
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
        <div class="row results center">
            <div
                class={fixClasses(
                    { animon: true, pushed: message.system.pushed },
                    "dice row wrap grow",
                )}
            >
                {#each die_results as die}
                    {#if inSuspense(message.system.suspense)}
                        <RollingDie />
                    {:else}
                        <Die value={die.result} discarded={!die.success} />
                    {/if}
                {/each}
            </div>
            <p class="result nowrap">
                <span
                    {@attach inSuspense(message.system.suspense)
                        ? rollScrambler(50, 6)
                        : null}>{roll.total}</span
                >
                vs
                <span>{message.system.params.difficulty}</span>
            </p>
        </div>

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
