<script>
    import { AnimonModel } from "../../../../models/actors/animon";
    import { stop } from "../../../../utils/handlers";
    import loc from "../../../../utils/localize";
    import Portrait from "../../../fields/Portrait.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import Breaker from "../../../layout/Breaker.svelte";
    import Tabs from "../../../layout/Tabs.svelte";

    let tabs = $derived.by(() => {
        let result = {};
        AnimonModel.TIERS.forEach((t) => {
            result[t] = {
                label: loc(`animon.forms.${t}`),
                onselect: () => {
                    // Show a context menu?
                    alert(t);
                },
            };
        });
        return result;
    });

    let { actor, edit } = $props();
    let active = $derived(actor.system.form?.tier);
</script>

<div class="header row inner-box">
    <Portrait
        doc={actor}
        {edit}
        class="inner-portrait"
        width="128px"
        height="128px"
    ></Portrait>
    <div class="grow col">
        <div class="grow bio">
            <div class="prefix-input">
                <label for="name">
                    <Breaker text={loc("animon.sheet.animon.name") + ":"}
                    ></Breaker>
                </label>
                <UpdateInput doc={actor} path="name" size="1"></UpdateInput>
            </div>
            <div class="prefix-input">
                <label for="name">
                    <Breaker text={loc("animon.sheet.kid.name")}></Breaker>:
                </label>
                <span class="readonly">
                    {actor.system.kid?.name ?? "No Kid"}
                </span>
            </div>
        </div>

        <div class="forms">
            <Tabs {tabs} {active}></Tabs>
        </div>
    </div>
</div>

<style lang="scss">
    .header {
        .bio {
            display: grid;
            grid-template-columns: 1fr 1fr;

            input {
                margin-right: 5px;
            }
        }
    }
</style>
