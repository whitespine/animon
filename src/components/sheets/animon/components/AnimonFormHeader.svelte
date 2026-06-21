<script>
    import { AnimonModel } from "../../../../models/actors/animon";
    import { stop } from "../../../../utils/handlers";
    import loc from "../../../../utils/localize";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
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
        <UpdateInput doc={actor} path="system.forms.{form_id}.name" size="1"></UpdateInput>
    </div>
    <div class="prefix-input">
        <label for="system.forms.{form_id}.element">
            <!--<Breaker text={loc("animon.sheet.animon.element")}></Breaker>:-->
            {loc("animon.sheet.animon.element")}:
        </label>
        <UpdateInput doc={actor} path="system.forms.{form_id}.element" size="1"></UpdateInput>
    </div>
</div>