<script>
    import { stop } from "../../utils/handlers";
    let { doc = null, callback = null, label = null } = $props();
    let fallback_label = $derived(label ?? `Delete ${doc?.name || ""}`)
</script>

<button
    onclick={(e) => (stop(e), callback ? callback(doc) : doc?.delete())}
    aria-label={fallback_label}
    data-tooltip={fallback_label}
>
    <i class="fas fa-trash"> </i>
</button>


<style lang="scss">
    button {
        margin: 2px;
        aspect-ratio: 1 / 1;
    }
</style>