<script>
    import loc from "../../../../utils/localize";
    import StatBox from "../../../fields/StatBox.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import XofX from "../../../fields/XofX.svelte";

    let { actor, form_id, edit } = $props();
</script>

<div class="sub-stats-box col center">
    <XofX label={loc("animon.sheet.animon.stats.hp.name")} doc={actor} max_path="system.forms.{form_id}.stats.hp" value_path="system.hp.value"></XofX>
    <StatBox label={loc("animon.sheet.animon.stats.damage.name")} doc={actor} path="system.forms.{form_id}.stats.damage"></StatBox>
    <StatBox label={loc("animon.sheet.animon.stats.dodge.name")} doc={actor} path="system.forms.{form_id}.stats.dodge"></StatBox>
    <StatBox label={loc("animon.sheet.animon.stats.initiative.name")} doc={actor} path="system.forms.{form_id}.stats.initiative"></StatBox>
</div>

<style lang="scss" module>
    .sub-stats-box {
        > * {
            width: 100%;
        }
    }
</style>
