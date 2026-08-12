<script lang="ts">
    import type { ContestContext } from "../../apps/contest_app";
    import type { ContestedTestParams } from "../../models/messages/contested_test";
    import { boostedFormula } from "../../utils/roll";
    import { suspense } from "../../utils/suspense.svelte";
    import Portrait from "../fields/Portrait.svelte";
    import { RollerState } from "./prompt/roller_state.svelte";
    import TestPrompt from "./prompt/TestPrompt.svelte";

    let ctx: ContestContext = $props();
    let message = $derived(ctx.message);
    let contestant = $derived(message.system.contestants[ctx.contestant_id]);
    let actor = $derived(contestant.actor);

    let state = $state(new RollerState());
    $effect(() => {
        state.speaker = ChatMessage.getSpeaker({
            actor: actor as Actor.Stored,
        });
    });

    async function fulfill() {
        let params: ContestedTestParams = {
            dice_pool: state.dice_pool,
            boost: state.boost,
            contributors: state.contributors,
            bond_points_spent: state.bond_points_spent,
        };
        let formula = boostedFormula(params.dice_pool, params.boost);
        let roll = await new Roll(formula).roll();
        message.update({
            system: {
                contestants: {
                    [ctx.contestant_id]: {
                        roll: JSON.stringify(roll.toJSON()),
                        params,
                        suspense: suspense(roll)
                    }
                }
            }
        })
    }
</script>

<div class="col">
    <h2>{contestant.prompt}</h2>
    <div class="inner-box row">
        <h3>VERSUS!</h3>
        <Portrait --portrait-size="64px" class="inner-portrait" doc={actor} />
        <h3 class="grow">{actor?.name}</h3>
    </div>

    <TestPrompt {state}></TestPrompt>
</div>

<style lang="scss">
</style>