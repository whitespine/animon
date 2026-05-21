<script>
    import { flip } from "svelte/animate";
    import { dndzone, TRIGGERS } from "svelte-dnd-action";
    import { DRAG_STATE, DragArea } from "./dnd.svelte";

    /** @import {AllowDropCallback, DragFromCallback, DragItem, DragMetaData, DragToCallback, DragStateSnapshot} from "./dnd.svelte" */

    /**
     * @type {({
     *   area: DragArea,
     *   documents: Array<Document>,
     *   on_drag_from: DragFromCallback,
     *   on_drag_to: DragToCallback,
     *   allow_drop: AllowDropCallback,
     *   allow_drag: boolean,
     * })}
     */
    let {
        documents,
        area,
        on_drag_from,
        on_drag_to,
        allow_drop,
        allow_drag=true,
        child, // How we render items. Should take DragItem as a parameter
        flip_duration_ms = 300,
    } = $props();

    let sorted_documents = $derived(documents.sort((a, b) => a.sort - b.sort));

    /** @type {DragItem[]} */
    let wrapped_documents_orig = $derived(
        sorted_documents.map((i) => ({
            id: idForDoc(i),
            doc: i,
            origin: area,
        })),
    );

    // Modified by svelte-dnd
    let wrapped_documents = $derived(wrapped_documents_orig);

    // Get a svelte-dnd id for a given document
    function idForDoc(doc) {
        return doc.uuid;
    }

    function handleDndConsider(e) {
        // console.error("CONSIDER", area.category, e.detail.info.trigger);
        if(e.detail.info.trigger == TRIGGERS.DRAG_STARTED) {
            let item = wrapped_documents.find(i => i.id == e.detail.info.id); // Fetch item before drag. Might be null on anything besides
            DRAG_STATE.setItem(item);
        }

        // Must be after the above
        wrapped_documents = e.detail.items;
    }

    function handleDndFinalize(e) {
        // Do default drop handling, always
        wrapped_documents = e.detail.items;
        // console.error("FINALIZE", area.category, e.detail.info.trigger);

        // Update drag state
        if(e.detail.info.trigger == TRIGGERS.DROPPED_INTO_ANOTHER) {
            // Only clear. State is set
            on_drag_from?.(DRAG_STATE.snapshot, e.detail.items);
            DRAG_STATE.clear();
        } else if(e.detail.info.trigger == TRIGGERS.DROPPED_INTO_ZONE) {
            DRAG_STATE.setArea(area);
            let snapshot = DRAG_STATE.snapshot;
            if(DRAG_STATE.item.origin == area) {
                // Drag to same area, meaning that we won't have a DROPPED_INTO_ANOTHER, so must clear here
                DRAG_STATE.clear();
            } // Otherwise dragged to a different area than origin, meaning that we will later have a DROPPED_INTO_ANOTHER, so don't clear yet.
            on_drag_to?.(snapshot, e.detail.items);
        }

    }
    // Conditionally disable drop if allow_drag is 
    let allow_drop_computed = $derived.by(() => {
        if(!allow_drop) return true;
        else if(!DRAG_STATE.dragging) return true;
        else return allow_drop(DRAG_STATE.item);
    })
</script>

<div
    class="list"
    use:dndzone={{
        items: wrapped_documents,
        flipDurationMs: flip_duration_ms,
        type: area.type,
        dropFromOthersDisabled: !allow_drop_computed,
        dragDisabled: !allow_drag
    }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
>
    {#each wrapped_documents as item (item.id)}
        <div animate:flip={{ duration: flip_duration_ms }}>
            {#if child}
                {@render child(item)}
            {:else}
                <span>{item.id}</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .list {
        height: 100%;
        min-height: 60px;
        display: flex;
        flex-direction: column;
    }
</style>
