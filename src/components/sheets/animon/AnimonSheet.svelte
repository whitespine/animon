<script>
    import { stop } from "../../../utils/handlers";
    import loc from "../../../utils/localize";
    import FormTab from "./FormTab.svelte";
    import BondBox from "../bond/BondBox.svelte";
    import AnimonHeader from "./components/AnimonHeader.svelte";
    import Sidebar from "../../layout/Sidebar.svelte";

    let { app, context } = $props();

    let mon = $derived(app.actor);
    let kid = $derived(mon.system.kid);

    // Human readable
    let edit = $state(true);

    // svelte-ignore state_referenced_locally
    let active_tab = $state(mon.system.active_form_id);
</script>

<form class="root" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>

    <AnimonHeader actor={mon} {edit} bind:activeTab={active_tab}></AnimonHeader>

    <div class="row">
        <Sidebar>
            <BondBox {mon} {kid} {edit}></BondBox>
        </Sidebar>
        {#if active_tab == "notes"}
            <span>TODO notes</span>
        {:else if mon.system.forms[active_tab]}
            <FormTab actor={mon} {edit} form_id={active_tab}></FormTab>
        {/if}
        <!-- TODO: Other modes, like notes-->
    </div>
</form>
