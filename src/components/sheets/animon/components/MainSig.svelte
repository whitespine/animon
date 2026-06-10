<script>
    import loc from "../../../../utils/localize";
    import {} from "../../../../models/base.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import {
        typedObjectToArray,
        sortedArrayToObject,
    } from "../../../../models/base.svelte";
    import { stop } from "../../../../utils/handlers";

    let { actor, edit, form_id } = $props();

    // Qualities on this form specifically
    let sig = $derived(actor.system.forms[form_id].signature);
    let effects = $derived(typedObjectToArray(sig.effects));
</script>

<div class="col main-signature-box">
    <h2 class="title">
        {loc("animon.sheet.animon.signature.title")}
    </h2>
    <div class="row even">
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.name"
                >{loc("animon.sheet.animon.signature.name")}</label
            >
            <UpdateInput
                doc={actor}
                path="system.form.{form_id}.signature.name"
                size="1"
            ></UpdateInput>
        </div>
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.rank"
                >{loc("animon.sheet.rank")}</label
            >
            <UpdateInput
                doc={actor}
                path="system.form.{form_id}.signature.rank"
                size="1"
            ></UpdateInput>
        </div>
    </div>
    <div class="row even">
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.element"
                >{loc("animon.sheet.animon.element")}</label
            >
            <UpdateInput
                doc={actor}
                path="system.form.{form_id}.signature.element"
                size="1"
            ></UpdateInput>
        </div>
        <div>
            <span>TODO: Cast button</span>
        </div>
    </div>
    {#each [1, 2, 3] as i}
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.effect.{i}">
                {loc("animon.sheet.animon.signature.effect")}
                {i}:
            </label>
            <UpdateInput
                doc={actor}
                path="system.form.{form_id}.signature.effect.{i}"
                size=1
            ></UpdateInput>
        </div>
    {/each}
</div>

<style lang="scss" module>
    .main-signature-box {
    }
</style>
