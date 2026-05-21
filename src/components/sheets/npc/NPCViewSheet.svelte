<script>
    import { stop } from "../../../utils/handlers";
    let { app, context } = $props();
    import Portrait from "../../fields/Portrait.svelte";

    let actor = $derived(context.actor);
    let canEdit = $derived(app.isEditable);

    function startEdit(e) {
        stop(e);
        app.props.edit = true;
    }
</script>

<div class="frame-body">
    <div class="header">
        <div class="portrait-stack">
            <Portrait
                doc={actor}
                path="img"
                height="175px"
                callback={(img) => app.setImage(img)}
                edit={false}
            />
            {#if canEdit}
                <button onclick={startEdit}>Edit</button>
            {/if}
        </div>
        <h1>{context.actor.name}</h1>
    </div>
</div>

<style lang="scss" module>
    .frame-body {
        display: flex;
        flex-direction: column;
        align-items: center;

        .portrait-stack {
            display: flex;
            flex-direction: column;
            align-items: center;
            button {
                width: 100%;
            }
        }

        .header {
            width: 100%;
            display: flex;
            flex-direction: row;
            border-bottom: solid black 2px;
            align-items: center;
        }
    }
</style>
