<script>
    import { resolveDotpath } from "../../utils/paths";
    import { stop } from "../../utils/handlers";
    let { doc, path, class: className, ...restProps } = $props();

    let checked = $derived(resolveDotpath(doc, path, ""));

    // No need for timeout logic
    function commit(new_value) {
        doc.update({
            [path]: new_value,
        });
    }
</script>

<input type="checkbox"
    oninput={(e) => commit(stop(e).target.checked)}
    {...restProps}
    class={className}
    {checked}
/>
