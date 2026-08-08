<script lang="ts">
    import { stop } from "../../utils/handlers";

    let {
        doc,
        path = "img",
        callback,
        fallback = "",
        height,
        edit = false,
        style = "",
        ...restArgs
    }: {
        doc: Actor | Item | ActiveEffect | TokenDocument,
        path?: string,
        callback?: (img: string) => any,
        fallback?: string,
        height?: number,
        edit?: boolean,
        style?: string
    } = $props();

    let current = $derived(foundry.utils.getProperty(doc, path) as string | undefined);

    // Stolen from foundry, modified
    async function editImage(e: Event) {
        stop(e);
        // @ts-ignore 
        const defaultArtwork = doc.constructor.getDefaultArtwork?.(doc._source) ?? {};
        const defaultImage = foundry.utils.getProperty(defaultArtwork, path) as string;
        const fp = new foundry.applications.apps.FilePicker.implementation({
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

        &.edit {
            cursor: pointer;
        }
    }
</style>
