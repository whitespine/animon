<script>
    import { stop } from "../../../utils/handlers";
    import loc from "../../../utils/localize";
    import GearTab from "./GearTab.svelte";
    import MainTab from "./MainTab.svelte";
    import NotesTab from "./NotesTab.svelte";

    let { app, context } = $props();
    const TABS = {
        main: "animon.sheet.tab.kid",
        gear: "animon.sheet.tab.gear",
        notes: "animon.sheet.tab.notes",
    };
    let actor = $derived(app.actor);
    let tab = $state("main");
    let edit = $state(true);

    function swapTab(e, tab_id) {
        stop(e);
        tab = tab_id;
    }
</script>

<form class="root" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>
    <div class="tabs">
        {#each Object.entries(TABS) as [tab_id, tab_label]}
            <button
                class={{ on: tab_id == tab }}
                onclick={(e) => swapTab(e, tab_id)}
            >
                {loc(tab_label)}
            </button>
        {/each}
    </div>


    <div class="body">
        {#if tab == "main"}
            <MainTab {actor} {edit}></MainTab>
        {:else if tab == "notes"}
            <NotesTab {actor} {edit}></NotesTab>
        {:else if tab == "gear"}
            <GearTab {actor} {edit}></GearTab>
        {/if}
    </div>
</form>

<style lang="scss">
    // For active buttons
    .on {
        background-color: var(--color-warm-1);
        color: var(--color-cool-5);
    }

    .tabs {
        display: flex;
        flex-direction: row;
        padding-bottom: 10px;

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
