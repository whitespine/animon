<script>
    import UpdateInput from "../../fields/UpdateInput.svelte";
    import { stop } from "../../../utils/handlers";
    import Portrait from "../../fields/Portrait.svelte";

    let { app, context } = $props();
    let actor = $derived(context.document);
</script>

<div class="npc-sheet" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>
    <!-- Prevents 'enter' from submitting the form unpredictably -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div>
        <Portrait
            doc={actor}
            path="img"
            height="175px"
            callback={(img) => app.setImage(img)}
            edit={true}
        />
    </div>
    <div>
        <label for="name">Name: </label>
        <UpdateInput name="name" doc={actor} path="name" />
    </div>
    <button onclick={() => app.props.edit = false}> Done Editing </button> 
    <!-- ^Snake eater means we don't need to stop propagation of this event -->
</div>

<style lang="scss" module>
    .npc-sheet {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>
