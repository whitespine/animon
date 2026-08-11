<script lang="ts">
    import { fixClasses } from "../../utils/classes";
    import { stop } from "../../utils/handlers";

    let {
        doc,
        path = "img",
        callback,
        fallback = "",
        edit = false,
        ...restArgs
    }: {
        doc: Actor | Item | ActiveEffect | TokenDocument;
        path?: string;
        callback?: (img: string) => any;
        fallback?: string;
        edit?: boolean;
    } & Record<string, any> = $props();

    let current = $derived(
        foundry.utils.getProperty(doc, path) as string | undefined,
    );

    // Stolen from foundry, modified
    async function editImage(e: Event) {
        stop(e);
        const defaultArtwork =
            // @ts-ignore
            doc.constructor.getDefaultArtwork?.(doc._source) ?? {};
        const defaultImage = foundry.utils.getProperty(
            defaultArtwork,
            path,
        ) as string;
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
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<img
    src={current ?? fallback}
    alt="Icon of {doc.name}"
    onclick={edit ? editImage : null}
    {...restArgs}
    class={fixClasses({ edit }, restArgs["class"])}
/>

<style lang="scss">
    img {
        object-fit: contain;
        min-height: var(--portrait-height, var(--portrait-size, 64px));
        min-width: var(--portrait-width, var(--portrait-size, 64px));
        max-height: var(--portrait-height, var(--portrait-size, 64px));
        max-width: var(--portrait-width, var(--portrait-size, 64px));

        &.edit {
            cursor: pointer;
        }
    }
</style>
