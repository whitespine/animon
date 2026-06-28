<script>
    import loc from "../../../../utils/localize";
    import {} from "../../../../models/base.svelte";
    
    import { stop } from "../../../../utils/handlers";
    import { reactive } from "../../../../utils/attach.svelte";

    let { actor, edit, form_id } = $props();
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
            <input {@attach reactive(actor, `system.forms.${form_id}.signature.name`)} size="1" >
        </div>
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.rank"
                >{loc("animon.sheet.rank")}</label
            >
            <input {@attach reactive(actor, `system.forms.${form_id}.signature.rank`)} size="1" >
        </div>
    </div>
    <div class="row even">
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.element"
                >{loc("animon.sheet.animon.element")}</label
            >
            <input {@attach reactive(actor, `system.forms.${form_id}.signature.element`)} size="1" >
        </div>
        <div>
            <span>TODO: Cast button</span>
        </div>
    </div>
    {#each [1, 2, 3] as i}
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.effects.{i}">
                {loc("animon.sheet.animon.signature.effect")}
                {i}:
            </label>
            <input {@attach reactive(actor, `system.forms.${form_id}.signature.effects.${i}.name`)} size=1 >
        </div>
    {/each}
</div>

<style lang="scss" module>
    .main-signature-box {
    }
</style>
