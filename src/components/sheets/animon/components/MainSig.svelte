<script>
    import loc from "../../../../utils/localize";
    import { reactive } from "../../../../utils/attach.svelte";
    import ElementalSelect from "../../../fields/ElementalSelect.svelte";

    let { actor, edit, form_id } = $props();
</script>

<div class="col main-signature-box">
    <h2 class="title row center">
        <label for="system.signature_uses.value">
            {loc("animon.sheet.animon.signature.title")}:
        </label>
        <input {@attach reactive(actor, "system.signature_uses.value")} size="1" class="nude center">
        <span>
            / {actor.system.forms[form_id]?.stats.signature_uses} 
        </span>
    </h2>
    <div class="row even">
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.name">
                {loc("animon.sheet.animon.signature.name")}
            </label>
            <input
                {@attach reactive(
                    actor,
                    `system.forms.${form_id}.signature.name`,
                )}
                size="1"
            />
        </div>
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.rank"
                >{loc("animon.sheet.rank")}</label
            >
            <input
                {@attach reactive(
                    actor,
                    `system.forms.${form_id}.signature.rank`,
                )}
                size="1"
            />
        </div>
    </div>
    <div class="row even">
        <div class="prefix-input">
            <label for="system.forms.{form_id}.signature.element"
                >{loc("animon.sheet.animon.element")}</label
            >
            <ElementalSelect
                {@attach reactive(
                    actor,
                    `system.forms.${form_id}.signature.element`,
                )}
                class="nude"
            ></ElementalSelect>
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
            <input
                {@attach reactive(
                    actor,
                    `system.forms.${form_id}.signature.effects.${i}.name`,
                )}
                size="1"
            />
        </div>
    {/each}
</div>

<style lang="scss" module>
</style>
