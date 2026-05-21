<script>
    import { stop } from "../../utils/handlers";

    let {
        doc,
        path = "img",
        callback = null,
        fallback = "",
        height=null,
        edit = false,
        style = "",
        ...restArgs
    } = $props();

    let current = $derived(foundry.utils.getProperty(doc, path));

    // Stolen from foundry, modified
    async function editImage(e) {
        stop(e);
        const defaultArtwork =
            doc.constructor.getDefaultArtwork?.(doc._source) ?? {};
        const defaultImage = foundry.utils.getProperty(defaultArtwork, path);
        // const fp = new FilePicker.implementation({ // v13
        const fp = new FilePicker({
            current,
            type: "image",
            redirectToRoot: defaultImage ? [defaultImage] : [],
            callback: callback || ((img) => doc.update({ [path]: img })),
            // position: {
            // top: this.position.top + 40,
            // left: this.position.left + 10
            // }
        });
        await fp.browse();
    }

    let full_style = $derived(height ? `max-height: ${height}; ${style}` : style);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<img
    src={current ?? fallback}
    alt="Icon of {doc.name}"
    onclick={edit ? editImage : null}
    class={{ "img-fluid": true, edit }}
    style={full_style}
    {...restArgs}
/>

<style lang="scss">
    img {
        object-fit: contain;
        background-color: grey;
        border: 2px solid black;

        &.edit {
            cursor: pointer;
        }
    }
</style>
