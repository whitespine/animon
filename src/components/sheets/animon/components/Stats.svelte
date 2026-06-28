<script>
    import { reactive } from "../../../../utils/attach.svelte";
    import loc from "../../../../utils/localize";
    

    let { actor, form_id, edit } = $props();
    let form = $derived(actor.system.forms[form_id]);
</script>

<div class="inner-box stats-box col">
    <h2>{loc("animon.sheet.animon.stats.title")}</h2>
    {#each ["heart", "power", "agility", "brains"] as stat (stat)}
        <div class="grow col center border">
            <label for="system.stats.{stat}">
                {loc(`animon.sheet.animon.stats.${stat}.name`)}:
            </label>
            <input {@attach reactive(actor, `system.forms.${form_id}.stats.${stat}`)} class="center nude" fallback="2" size="1"
            >
        </div>
    {/each}
</div>

<style lang="scss">
    .border:not(:last-child) {
        width: 100%;
        border-bottom: var(--dash-line);
    }
</style>
