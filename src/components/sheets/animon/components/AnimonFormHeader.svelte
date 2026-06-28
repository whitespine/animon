<script>
    import { reactive } from "../../../../utils/attach.svelte";
    import loc from "../../../../utils/localize";
    import ElementalSelect from "../../../fields/ElementalSelect.svelte";

    import Breaker from "../../../layout/Breaker.svelte";

    let { actor, form_id, edit } = $props();
</script>

<div class="row even inner-box">
    <div class="prefix-input">
        <label for="system.forms.{form_id}.name">
            <!--<Breaker text={loc("animon.sheet.animon.form_name") + ":"}
            ></Breaker>-->
            {loc("animon.sheet.animon.form_name")}:
        </label>
        <input
            {@attach reactive(actor, `system.forms.${form_id}.name`)}
            size="1"
        />
    </div>
    <div class="prefix-input">
        <label for="system.forms.{form_id}.element">
            <!--<Breaker text={loc("animon.sheet.animon.element")}></Breaker>:-->
            {loc("animon.sheet.animon.element")}:
        </label>
        <input
            {@attach reactive(actor, `system.forms.${form_id}.element`)}
            size="1"
        />
        <ElementalSelect
            {@attach reactive(actor, `system.forms.${form_id}.element`)}
            class="nude"
        ></ElementalSelect>
    </div>
</div>
