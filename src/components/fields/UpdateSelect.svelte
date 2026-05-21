<script>
    import { resolveDotpath } from "../../utils/paths";
    import { stop } from "../../utils/handlers";
    let { doc, path, options, ...restProps } = $props();

    let value = $derived(resolveDotpath(doc, path, false));

    // No need for timeout logic
    function commit(new_value) {
        doc.update({
            [path]: new_value,
        });
    }
</script>

<select
    oninput={(e) => commit(stop(e).target.value)}
    {...restProps}
    {value}
>
    {#each Object.entries(options) as [key, label]}
        <option value={key}>{label}</option>
    {/each}
</select>
