<script>
    import loc from "../../../../utils/localize";
    import UpdateInput from "../../../fields/UpdateInput.svelte";

    let { actor, edit } = $props();
</script>

<div class="inner-box stamina-box">
    <h2>{loc("animon.sheet.kid.stamina")}</h2>
    <UpdateInput doc={actor} path="system.stamina.value" size="1"></UpdateInput>

    /

    <span>{actor.system.stamina.max}</span>
</div>

<style lang="scss" module>
    .stamina-box {
        display: flex;
        flex-direction: row;
        align-items: center;

        h2{
            flex: 0 1;
            border-right: var(--dash-line);
        }

        input, span {
            flex: 1 0;
            text-align: center;
        }
    }
</style>
