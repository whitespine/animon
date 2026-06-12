<script>
    import { AnimonModel } from "../../../../models/actors/animon";
    import { stop } from "../../../../utils/handlers";
    import loc from "../../../../utils/localize";
    import { fixClasses } from "../../../../utils/classes";
    import Portrait from "../../../fields/Portrait.svelte";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import Breaker from "../../../layout/Breaker.svelte";

    let { actor, edit, activeTab = $bindable() } = $props();

    // What to show on the volve button
    let volve_message = $derived.by(() => {
        let current_form = actor.system.form; // Can be undefined
        let viewed_form = actor.system.forms[activeTab]; // Can be undefined
        if (!current_form) return "animon.forms.init"; // Don't have a form - jump to one.
        if (!viewed_form || viewed_form == current_form) return "animon.forms.active"; // Nothing to volve

        let cft = AnimonModel.tierAsInt(current_form.tier);
        let nft = AnimonModel.tierAsInt(viewed_form.tier);
        if (cft < nft) {
            return "animon.forms.evolve";
        } else if (cft > nft) {
            return "animon.forms.devolve";
        } else {
            return "animon.forms.revolve";
        }
    });

    // Whether pushing the button is something we want to be allowed
    let can_volve = $derived("animon.forms.active" != volve_message);

    let active_tier = $derived(actor.system.form?.tier);
    let viewed_tier = $derived(actor.system.forms[activeTab]?.tier);

    function volve(e) {
        stop(e);
        actor.system.volveTo(activeTab);
    }

    async function viewTier(tier) {
        let form_id = await actor.system.getOrCreateForm(tier);
        activeTab = form_id;
    }
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
        <div class="even">
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

        <div class="forms row even">
            {#each AnimonModel.TIERS as tier}
                <button
                    class={{
                        active: active_tier == tier,
                        viewed: viewed_tier == tier,
                    }}
                    onclick={(e) => [stop(e), viewTier(tier)]}
                >
                    {loc(`animon.forms.${tier}`)}
                </button>
            {/each}
        </div>
    </div>

    <button
        class={fixClasses("grow", { disabled: !can_volve })}
        onclick={volve}
    >
        {loc(volve_message)}
    </button>
</div>

<style lang="scss">
    .forms button {
        height: 3em;
        margin-bottom: var(--unpad);

        &.active {
            font-weight: bolder;
        }

        &.viewed {
            background-color: var(--color-warm-1);
            color: var(--color-cool-5);
        }
    }
</style>
