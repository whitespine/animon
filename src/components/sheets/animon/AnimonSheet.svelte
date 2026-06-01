<script>
    import { stop } from "../../../utils/handlers";
    import loc from "../../../utils/localize";
    import { sortedObjectToArray } from "../../../models/base.svelte";
    import { AnimonModel } from "../../../models/actors/animon";
    import FormTab from "./FormTab.svelte";
    import BondBox from "../bond/BondBox.svelte";
    import AnimonHeader from "./components/AnimonHeader.svelte";

    let { app, context } = $props();

    let mon = $derived(app.actor);
    let kid = $derived(mon.system.kid);

    // Human readable
    let edit = $state(true);

    let active_mode = $state("form");
    // svelte-ignore state_referenced_locally
    let active_args = $state({form_id: mon.system.active_form_id ?? ""});

    function selectTab(new_active_mode, new_active_args) {
        active_mode = new_active_mode;
        active_args = new_active_args;
    }

    let activeTab = $derived.by(() => {
        if(active_mode == "form") {
            return mon.system.forms[active_args.form_id].tier;
        }
    });
</script>

<form class="root" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>

    <AnimonHeader actor={mon} {edit} {selectTab} {activeTab}></AnimonHeader>

    <div class="row">
        <BondBox mon={mon} {kid} {edit}></BondBox>
        {#if active_mode=="form"}
            <FormTab actor={mon} {edit} {...active_args}></FormTab>
        {/if}
        <!-- TODO: Other modes, like notes-->
    </div>
</form>
