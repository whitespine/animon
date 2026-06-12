<script>
    import MainSig from "./MainSig.svelte";
    import ToolTip from "../../../layout/ToolTip.svelte";
    import loc from "../../../../utils/localize";
    let { actor, edit, form_id } = $props();

    let moves = $derived(
        actor.system.form?.signature ? [actor.system.form.signature] : [],
    );
</script>

<div class="inner-box signature-box">
    <MainSig {actor} {edit} {form_id}></MainSig>
    <div class="row">
        {#each moves as move}
            <ToolTip>
                {#snippet on(attacher)}
                    <button {@attach attacher} class="pill">
                        {move.name}
                    </button>
                {/snippet}

                {#snippet tip()}
                    <div class="col">
                        <h2 class="row even">
                            <span class="grow">{loc("animon.sheet.animon.element")}: {move.element}</span>
                            <span>{loc("animon.sheet.rank")}: {move.rank}</span>
                        </h2>
                        {#each [1,2,3] as i}
                            {#if move.effects[i].name.trim()}
                                <span>{loc("animon.sheet.animon.signature.effect")}: {move.effects[i].name}</span>
                            {/if}
                        {/each}
                    </div>
                {/snippet}
            </ToolTip>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .sig-pill {
    }
</style>
