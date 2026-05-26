<script>
    import { stop } from "../../../../utils/handlers";
    import loc from "../../../../utils/localize";
    import Portrait from "../../../fields/Portrait.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";

    let { actor, edit } = $props();
</script>

<div class="header inner-box">
    <Portrait doc={actor} {edit} class="inner-portrait" width="128px" height="128px"></Portrait>
    <div class="bio">
        <div class="prefix-input">
            <label for="name"> {loc("animon.sheet.kid.name")}: </label>
            <UpdateInput doc={actor} path="name" size="1"></UpdateInput>
        </div>

        {#snippet field(key)}
            <div class="prefix-input">
                <label for="system.{key}">
                    {loc(`animon.sheet.kid.${key}`)}:
                </label>
                <UpdateInput doc={actor} path="system.{key}" size="1"></UpdateInput>
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
        display: flex;
        flex-direction: row;

        .inner-portrait {
            margin-right: 5px;
        }

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
