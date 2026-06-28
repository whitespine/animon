<script>
    import loc from "../../../../utils/localize";
    import { stop } from "../../../../utils/handlers";
    import { slide } from "svelte/transition";

    let { actor, edit, direction = "col" } = $props();
    let xp = $derived(actor.system.xp);

    function clickXP(number) {
        if (xp == number) {
            number--;
        }
        actor.update({ "system.xp": number });
    }
</script>

<div class="center {direction} even">
    <h2>{loc("animon.sheet.bond.xp")}</h2>
    {#each { length: 10 } as _, i}
        <div class="button-host">
            <button
                class={{
                    checked: xp >= i + 1,
                    half: xp == 5,
                    whole: xp == 10,
                }}
                onclick={(e) => (stop(e), clickXP(i + 1))}
                aria-label={`Set xp to ${xp == i ? i - 1 : i}`}
            ></button>
        </div>
    {/each}
</div>

<style lang="scss">
    .button-host {
        align-items: center;
        justify-content: center;
        button {
            --size: 24px;

            // Make it round
            border: 2px solid black;
            border-radius: 50%;
            margin-bottom: 2px;

            background-color: white;

            // Make it the right size
            font-size: 0px;
            min-width: var(--size);
            min-height: var(--size);

            &.checked {
                background-color: black;
            }
        }
    }
</style>
