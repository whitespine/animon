<script>
    import { stop } from "../../../utils/handlers";
    import loc from "../../../utils/localize";
    import Tabs from "../../layout/Tabs.svelte";
    import GearTab from "./GearTab.svelte";
    import MainTab from "./MainTab.svelte";
    import MonTab from "./MonTab.svelte";
    import NotesTab from "./NotesTab.svelte";

    let { app, context } = $props();

    let actor = $derived(app.actor);
    let edit = $state(true);

    // Our active tab
    let tab = $state("kid");

    // What each tab maps to
    const TAB_COMPONENTS = {
        kid: MainTab,
        animon: MonTab,
        gear: GearTab,
        notes: NotesTab,
    };
    let ActiveTab = $derived(TAB_COMPONENTS[tab])

    // Human readable
    const TAB_LABELS = Object.fromEntries(Object.keys(TAB_COMPONENTS).map(k => [k, loc(`animon.sheet.tab.${k}`)]));
</script>

<form onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>
    <Tabs tabs={TAB_LABELS} active={tab} onselect={(t) => tab = t}></Tabs>
    <div>
        {#if TAB_COMPONENTS[tab]}
            <ActiveTab {actor} {edit}></ActiveTab>
        {/if}
    </div>
</form>

<style lang="scss">
</style>
