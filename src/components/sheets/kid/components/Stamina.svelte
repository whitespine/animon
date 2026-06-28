<script>
    import { reactive } from "../../../../utils/attach.svelte";
import loc from "../../../../utils/localize";
    

    let { actor, edit } = $props();
</script>

<div class="inner-box row center">
    <h2>{loc("animon.sheet.kid.stamina")}</h2>
    <input class="center nude" {@attach reactive(actor, "system.stamina.value")} size="1">

    <span class="slash">/</span>

    <span>{actor.system.stamina.max}</span>
</div>

<style lang="scss">
    h2 {
        flex: 0 1;
        border-right: solid gray 2px;
        margin-right: 10px;
        padding-right: 10px;
    }

    span {
        flex: 1 0;
        text-align: center;
    }

    .slash {
        font-size: 3rem;
        font-weight: 100;
        margin-top: -1.5rem;
        margin-bottom: -1.5rem;
    }
</style>
