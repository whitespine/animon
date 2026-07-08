<script lang="ts">
    import type { ContestContext } from "../../apps/contest_app";
    import Portrait from "../fields/Portrait.svelte";
    import { RollerState } from "./prompt/roller_state.svelte";
    import TestPrompt from "./prompt/TestPrompt.svelte";

    let ctx: ContestContext = $props();

    let actor = $derived(ctx.actor);
    let prompt = $derived(ctx.prompt);

    let state = $state(new RollerState());
    $effect(() => {
        state.speaker = ChatMessage.getSpeaker({actor: actor as Actor.Stored})
    });
</script>


<div class="col">
    <h2>{prompt}</h2>
    <div class="inner-box row even">
        <Portrait
            width="64px"
            height="64px"
            class="inner-portrait"
            doc={actor}
        />
        <h3 class="grow">{actor.name}</h3>
    </div>

    <TestPrompt {state}></TestPrompt>
</div>