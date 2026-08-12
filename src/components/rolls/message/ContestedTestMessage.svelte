<script lang="ts">
    import Die from "../Die.svelte";
    import RollingDie from "../RollingDie.svelte";
    import ToolTip from "../../layout/ToolTip.svelte";
    import { suspense, inSuspense } from "../../../utils/suspense.svelte";
    import { fixClasses } from "../../../utils/classes";
    import type { ContestChatMessage } from "../../../documents/message.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    import RollDisplay from "./RollDisplay.svelte";
    import { stop } from "../../../utils/handlers";
    import { ContestedApp } from "../../../apps/contest_app";

    let { message }: { message: ContestChatMessage } = $props();

    function resolve(contestant_id: string) {
        let ctx = {message, contestant_id};
        if(!ContestedApp.active.get(ContestedApp.keyFor(ctx))) {
            new ContestedApp(ctx).render({force: true});
        }
    }
</script>

<div class="animon">
    <h2>{message.system.title}</h2>
    {#if message.system.subtitle}
        <p>{message.system.subtitle}</p>
    {/if}
    {#each Object.entries(message.system.contestants) as [id, contestant] (id)}
        <div class="inner-box row center contain contestant">
            {#if contestant.actor}
                <Portrait
                    class="inner-portrait"
                    doc={contestant.actor}
                    --portrait-width="64px"
                    --portrait-height="100%"
                />
            {:else}
                <p class="italic void">???</p>
            {/if}

            <div class="col">
                <h4>{contestant.actor?.name ?? "Unknown"}</h4>

            {#if contestant.roll}
                <RollDisplay roll={contestant.roll} --die-size="24px" contributors={contestant.params!.contributors || []}>
                    {#snippet result(val)}
                        <span class="nowrap result"> → {val}</span>
                    {/snippet}
                </RollDisplay>
            {:else}
                {#if contestant.actor?.isOwner}
                    <button class="italic" onclick={(e) => [stop(e), resolve(id)]}>Resolve</button>
                {:else}
                    <span class="italic">Pending...</span>
                {/if}
            {/if}
            </div>
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
