<script lang="ts">
    import Die from "../Die.svelte";
    import RollingDie from "../RollingDie.svelte";
    import ToolTip from "../../layout/ToolTip.svelte";
    import { suspense, inSuspense } from "../../../utils/suspense.svelte";
    import { fixClasses } from "../../../utils/classes";
    import type { ContestChatMessage } from "../../../documents/message.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    import RollDisplay from "./RollDisplay.svelte";

    let { message }: { message: ContestChatMessage } = $props();

    $inspect(message.system.contestants);
</script>

<div class="animon">
    <h2>{message.system.title}</h2>
    {#if message.system.subtitle}
        <p>{message.system.subtitle}</p>
    {/if}
    {#each Object.entries(message.system.contestants) as [k, contestant] (k)}
        <div class="inner-box row center contain contestant">
            {#if contestant.actor}
                <Portrait
                    height="var(--portrait-size)"
                    class="inner-portrait"
                    doc={contestant.actor}
                />
                <span>{contestant.actor.name}</span>
            {:else}
                <p class="italic void">???</p>
            {/if}

            {#if contestant.roll}
                <RollDisplay roll={contestant.roll}>
                    {#snippet result(val)}
                        <span class="result"> → {val}</span>
                    {/snippet}
                </RollDisplay>
            {:else}
                <span>Pending...</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .contestant {
        --portrait-size: 64px;

        .void {
            width: var(--portrait-size);
            height: var(--portrait-size);
            line-height: var(--portrait-size);


            text-align: center;
            margin-left: var(--unpad);
            margin-top: var(--unpad);
            margin-bottom: var(--unpad);
            margin-right: 5px;

            background-color: black;
            background-color: black;
            color: white;
        }
    }
    .result {
        font-size: x-large;
        font-weight: bold;
        padding-inline: 5px;
    }
</style>
