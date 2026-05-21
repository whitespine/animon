<script>
    import { DragArea } from "./dnd.svelte";
    import SortableDocumentList from "./SortableDocumentList.svelte";

    /**
     * @type {({
     *   actor: Actor,
     *   child: Snippet,
     *   documents: Document[],
     *   area: DragArea,
     *   update_mod: (Document) => object
     *   allow_drop: Optional<AllowDropCallback>
     * })}
     */
    let {
        actor,
        child,
        documents,
        area,
        update_mod = null,
        allow_drop = null,
        ...restProps
    } = $props();

    const SORT_SPACING = 1000;

    /** @import {AllowDropCallback, DragFromCallback, DragItem, DragMetaData, DragToCallback, DragStateSnapshot} from "./dnd.svelte" */

    /** @type {DragToCallback}*/
    const on_drag_from = async (snap, all_items) => {
        // Don't care about sort, never affected by an on drag from
        if (!snap.dest_area.sameCollection(snap.item.origin)) {
            // It has been dragged out of this collection - delete it!
            // Maybe prompt first?
            await snap.item.doc.delete();
        }
    };

    /** @type {DragFromCallback}*/
    const on_drag_to = async (snap, all_items) => {
        let all_docs = all_items.map((i) => i.doc);
        if (!snap.dest_area.sameCollection(snap.item.origin)) {
            // We need to transfer the item
            let new_doc_index = all_items.findIndex(
                (di) => di.id == snap.item.id,
            );
            let new_doc_src = snap.item.doc.toJSON();
            new_doc_src.sort = new_doc_index * SORT_SPACING;
            let new_docs = await area.document_class.createDocuments(
                [new_doc_src],
                { parent: actor },
            );
            all_docs[new_doc_index] = new_docs[0];
        }

        // Apply sort universally, additionally dump
        await area.document_class.updateDocuments(
            all_docs.map((doc, index) => ({
                _id: doc._id,
                sort: index * SORT_SPACING,
                ...(update_mod?.(doc) ?? {}),
            })),
            { parent: actor },
        );
    };

    /** @type {AllowDropCallback} */
    const combined_allow_drop = (di) => {
        // Also check that they're an owner of this document
        let supa = restProps.allow_drop?.(di) || true;
        return supa || actor.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    };
</script>

<SortableDocumentList
    {child}
    {area}
    {documents}
    {on_drag_from}
    {on_drag_to}
    allow_drop={combined_allow_drop}
    {...restProps}
/>
