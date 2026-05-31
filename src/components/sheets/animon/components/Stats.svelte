<script>
    import loc from "../../../../utils/localize";
    import UpdateInput from "../../../fields/UpdateInput.svelte";

    let { actor, form_id, edit } = $props();
    let form = $derived(actor.system.forms[form_id]);
</script>

<div class="inner-box stats-box col center">
    <h2>{loc("animon.sheet.animon.stats.title")}</h2>
    {#each ["heart", "power", "agility", "brains"] as stat (stat)}
        <label for="system.stats.{stat}">
            {loc(`animon.sheet.animon.stats.${stat}.name`)}:
        </label>
        <UpdateInput
            doc={actor}
            path="system.forms.{form_id}.{stat}"
            class="center nude"
            size="1"
        ></UpdateInput>
        <div class="border"></div>
    {/each}
</div>

<style lang="scss">
    .border:not(:last-child) {
        width: 100%;
        border-bottom: var(--dash-line);
    }
</style>
