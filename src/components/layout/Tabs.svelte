<script>
    import { stop } from "../../utils/handlers";
    // Tabs should map from a key (which will be emitted) to a 
    let { tabs = {}, active="", onselect=((_key) => {}) } = $props();

    let labels = $derived(Object.fromEntries(Object.entries(tabs).map(([k, v]) => {
        if(typeof v == "object" && v.label) {
            return [k, v.label]
        } 
        return [k, v];
    })));

    // Callbacks on each entry will
    let callbacks = $derived(Object.fromEntries(Object.entries(tabs).map(([k, v]) => {
        if(typeof v == "object" && v.onselect) {
            return [k, v.onselect];
        }
        return [k, onselect];
    })));
    $inspect(tabs);
    $inspect(labels);
    $inspect(callbacks);
</script>

<div class="tabs row even">
    {#each Object.keys(tabs) as k (k)}
        <button
            class={{ on: active == k }}
            data-tab={k}
            onclick={(e) => [stop(e), callbacks[k](k)]}
        >
            {labels[k]}
        </button>
    {/each}
</div>

<style lang="scss">
    // For active buttons
    .on {
        background-color: var(--color-warm-1);
        color: var(--color-cool-5);
    }

    .tabs {
        padding-bottom: 10px;

        > * {
            flex: 1 0;
        }

        button {
            height: 3em;
        }
    }
</style>