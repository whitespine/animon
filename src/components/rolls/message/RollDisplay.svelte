<script lang="ts">
    import Die from "../Die.svelte";
    import RollingDie from "../RollingDie.svelte";
    import ToolTip from "../../layout/ToolTip.svelte";
    import { inSuspense } from "../../../utils/suspense.svelte";
    import { fixClasses } from "../../../utils/classes";
    import { rollScrambler } from "../../../utils/attach.svelte";
    import type {Snippet} from "svelte";
    import type { Contributor } from "../../../models/messages/base";

    let {
        roll,
        contributors = [],
        suspense_id,
        vs,
        pushed = false,
    }: {
        roll: Roll;
        contributors?: Contributor[]
        suspense_id?: string | null;
        vs?: Snippet
        pushed?: boolean;
    } = $props();

    /** The values on our d6's */
    let die_results = $derived(roll.dice[0].results);
</script>

<div class="row results center">
    <ToolTip side="left">
        {#snippet on(attacher)}
            <div
                class={fixClasses(
                    { animon: true, pushed },
                    "dice row wrap grow",
                )}
                {@attach attacher}
            >
                {#each die_results as die}
                    {#if inSuspense(suspense_id)}
                        <RollingDie />
                    {:else}
                        <Die value={die.result} discarded={!die.success} />
                    {/if}
                {/each}
            </div>
        {/snippet}
        {#snippet tip()}
            <div class="inner-box col">
                {#each contributors as contrib}
                    <div class="prefix-input even">
                        {#if !contrib.value}
                            <span class="pseudo-label" style:text-align="center"
                                >{contrib.label}</span
                            >
                        {:else}
                            <span class="pseudo-label">{contrib.label}: </span>
                            <span style:text-align="right">{contrib.value}</span
                            >
                        {/if}
                    </div>
                {/each}
            </div>
        {/snippet}
    </ToolTip>
    <p class="result nowrap">
        <span {@attach inSuspense(suspense_id) ? rollScrambler(50, 6) : null}
            >{roll.total}</span
        >
        {@render vs?.()}
    </p>
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
