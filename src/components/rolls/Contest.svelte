<script lang="ts">
    import type { ContestContext } from "../../apps/contest_app";
    import Portrait from "../fields/Portrait.svelte";
    import { RollerState } from "./prompt/roller_state.svelte";
    import TestPrompt from "./prompt/TestPrompt.svelte";

    let ctx: ContestContext = $props();
    let message = $derived(ctx.message);
    let contestant = $derived(message.system.contestants[ctx.contestant_uuid]);
    let actor = $derived(fromUuidSync(ctx.contestant_uuid) as Actor);

    let state = $state(new RollerState());
    $effect(() => {
        state.speaker = ChatMessage.getSpeaker({actor: actor as Actor.Stored})
    });


    function fulfill() {

    }
</script>


<div class="col">
    <h2>{prompt}</h2>
    <div class="inner-box row">
        <h3>VERSUS!</h3>
        <Portrait
            --portrait-size="64px"
            class="inner-portrait"
            doc={actor}
        />
        <h3 class="grow">{actor?.name}</h3>
    </div>

    <TestPrompt {state}></TestPrompt>
</div>