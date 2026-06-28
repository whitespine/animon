<script>
    import { reactive } from "../../../../utils/attach.svelte";
    import { stop } from "../../../../utils/handlers";
    import loc from "../../../../utils/localize";
    import Portrait from "../../../fields/Portrait.svelte";
    

    let { actor, edit } = $props();
</script>

<div class="header row inner-box contain">
    <Portrait
        doc={actor}
        {edit}
        class="inner-portrait"
        width="128px"
        height="128px"
    ></Portrait>
    <div class="bio">
        <div class="prefix-input">
            <label for="name"> {loc("animon.sheet.kid.name")}: </label>
            <input {@attach reactive(actor, "name")} size="1" >
        </div>

        {#snippet field(key)}
            <div class="prefix-input">
                <label for="system.{key}">
                    {loc(`animon.sheet.kid.${key}`)}:
                </label>
                <input {@attach reactive(actor, `system.${key}`)} size="1"
                >
            </div>
        {/snippet}
        {@render field("player_name")}
        {@render field("virtue")}
        {@render field("flaw")}
        {@render field("desire")}
        {@render field("special_item")}
    </div>
</div>

<style lang="scss" module>
    .header {
        .bio {
            flex: 1 0;
            display: grid;
            grid-template-columns: 1fr 1fr;

            input {
                margin-right: 5px;
            }
        }
    }
</style>
