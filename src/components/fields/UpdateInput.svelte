<script>
    import { resolveDotpath } from "../../utils/paths";
    import { stop } from "../../utils/handlers";
    let {
        tag = "input",
        doc,
        path,
        preprocess_value = null,
        update_callback = null,
        ...restProps
    } = $props();

    let value = $derived(resolveDotpath(doc, path, ""));

    let change_timeout = null;
    function commit(new_value, delay) {
        if (preprocess_value) new_value = preprocess_value(new_value);
        value = new_value;
        if (change_timeout) {
            clearTimeout(change_timeout);
            change_timeout = null;
        }
        let update = update_callback
            ? () => update_callback(new_value)
            : () => {
                  doc.update({
                      [path]: new_value,
                  });
              };
        if (delay > 0) {
            change_timeout = setTimeout(update, delay);
        } else {
            update();
        }
    }
</script>

<svelte:element
    this={tag}
    onchange={(e) => commit(stop(e).target.value, 0)}
    oninput={(e) => commit(stop(e).target.value, 1000)}
    {...restProps}
    {value}
/>
