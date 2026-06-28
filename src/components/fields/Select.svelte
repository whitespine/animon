<script>
    import { stop } from "../../utils/handlers";

    let {
        options = [],
        selected = $bindable(null),
        ...restProps
    } = $props();

    $effect(() => {
        if(options.length && !options.some(x => selected == x.id)) {
            selected = options[0].id ?? null;
        }
    });
</script>

<select value={selected} onchange={(e) => selected = stop(e).target.value} {...restProps}>
    {#each options as option}
        <option value={option.id}>
            {option.label}
        </option>
    {/each}
</select>
