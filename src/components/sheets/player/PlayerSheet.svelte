<script>
    import { stop } from "../../../utils/handlers";
    import Portrait from "../../fields/Portrait.svelte";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte";
    import UpdateInput from "../../fields/UpdateInput.svelte";
    import ViewGear from "../../items/ViewGear.svelte";

    let { app, context } = $props();
    const TABS = {
        bio: "Biography",
        gear: "Gear",
    };
    let actor = $derived(app.actor);
    let tab = $state("bio");
    let edit = $state(false);
    let items = $derived(Array.from(context.actor.items.svelte.values()));

    function swapTab(e, tab_id) {
        stop(e);
        tab = tab_id;
    }
</script>

<form class="root" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>
    <div class="header">
        <Portrait doc={actor} {edit} width="128px" height="128px"></Portrait>
        <div class="name-section">
            {#if edit}
                <label for="name"> Name: </label>
                <UpdateInput doc={actor} path="name" name="name"></UpdateInput>
            {:else}
                <span> Name: {actor.name} </span>
            {/if}
        </div>
    </div>
    <div class="tabs">
        {#each Object.entries(TABS) as [tab_id, tab_label]}
            <button
                class={{ on: tab_id == tab }}
                onclick={(e) => swapTab(e, tab_id)}
            >
                {tab_label}
            </button>
        {/each}
        <button
            aria-label="Toggle Edit"
            onclick={(e) => (stop(e), (edit = !edit))}
            class={{ on: edit, edit: true }}
        >
            Edit
            <i class="fas fa-edit"></i>
        </button>
    </div>

    <div class="body">
        {#if tab == "bio"}
            <div>
                <h3>Biography</h3>
                {#if edit}
                    <ProsemirrorField doc={actor} path="system.biography"
                    ></ProsemirrorField>
                {:else}
                    {@html actor.system.biography}
                {/if}
            </div>
        {:else if tab == "gear"}
            <div>
                <h3>Gear</h3>
                {#each items as i}
                    <ViewGear item={i} {edit}></ViewGear>
                {/each}
            </div>
        {/if}
    </div>
</form>

<style lang="scss">
    .header {
        display: flex;
        align-items: center;
    }

    // For active buttons
    .on {
        background-color: var(--color-warm-1);
        color: var(--color-cool-5);
    }

    .tabs {
        display: flex;
        flex-direction: row;
        border-bottom: solid black 1px;
        padding: 20px 0px;

        > * {
            flex-grow: 2;
        }

        .edit {
            flex-grow: 1;
        }

        button {
            height: 3em;
        }
    }
</style>
