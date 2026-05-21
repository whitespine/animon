
<script>
    import {stop} from "../../utils/handlers";

    function disableWelcome(e) {
        stop(e);
        game.settings.
    }
</script>

<div>
    <h1>{game.i18n.localize("MY_SYSTEM_ID.welcome.banner")}</h1>    
    <button onclick={disableWelcome}>{game.i18n.localize("MY_SYSTEM_ID.welcome.stop")}</button>
</div>
