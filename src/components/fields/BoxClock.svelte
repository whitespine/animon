<script>
    import { stop } from "../../utils/handlers";
    import { resolveDotpath } from "../../utils/paths";
    let { 
        doc,
        path
    } = $props();
    let value = $derived(resolveDotpath(doc, path, 0));

    function click(selected) {
        if (value == selected) {
            selected--;
        }
        doc.update({

            [path]: selected
        })
    }
</script>

<div class="container col">
    {#each { length: 10 } as _, i}
        <button
            class={{ col: true, checked: value >= i + 1 }}
            onclick={(e) => (stop(e), click(i + 1))}
            aria-label={`Set to ${value == i ? i - 1 : i}`}
        ></button>
    {/each}
</div>

<style lang="scss">
    .container {
        margin-top: 6px;
    }
    button {
        --size: 16px;
        min-width: var(--size);
        max-width: var(--size);
        min-height: var(--size);
        max-height: var(--size);

        border: solid black 2px;
        background-color: white;
        margin: 1px;
        &.checked {
            background-color: black;
        }
    }
</style>
