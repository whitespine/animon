<script>
    import { stop } from "../../utils/handlers";
    let { doc = null, callback = null, label = null } = $props();
    let fallback_label = $derived(label ?? `Edit ${doc?.name || ""}`)
</script>

<button
    onclick={(e) => (stop(e), callback ? callback(doc) : doc?.sheet?.render({force: true}))}
    aria-label={fallback_label}
    data-tooltip={fallback_label}
>
    <i class="fas fa-edit"> </i>
</button>


<style lang="scss">
    button {
        margin: 2px;
        aspect-ratio: 1 / 1;
    }
</style>