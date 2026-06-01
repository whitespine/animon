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

    // Dynamically generate
    let tabs = $derived.by(() => {
        let r = {};
        const establishForm = (tier) => {
            let existing_form = mon.system.formForTier(tier);
            if (existing_form) {
                r[tier] = {
                    label: `${tier} - ${existing_form.name}`,
                    onselect: () => swapForm(tier),
                };
            } else {
                r[tier] = {
                    label: `+${tier}`,
                    onselect: () => swapEmptyForm(tier),
                };
            }
        };
        AnimonModel.TIERS.forEach((t) => establishForm(t));
    });

    // Human readable
    let current_form_tier = $derived(mon.system.form?.tier ?? "fledgling");
    let edit = $state(true);

    // Swap to a form that doesn't exist yet
    async function swapEmptyForm(new_form_tier) {
        let new_id = foundry.utils.randomID();
        await mon.update({
            [`system.forms.${new_id}`]: {
                tier: new_form_tier,
            }, // Rest will default
            "system.active_form_id": new_id,
        });
    }

    function toggleEdit(e) {
        stop(e);
        edit = !edit;
    }
</script>

<form class="root" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>

    <AnimonHeader actor={mon} {edit} ></AnimonHeader>

    <div class="row">
        <BondBox mon={mon} {kid} {edit}></BondBox>
        <FormTab actor={mon} form_id={mon.system.active_form_id} {edit}></FormTab>
    </div>
</form>
