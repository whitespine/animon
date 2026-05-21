export class DragArea {
    constructor({ document_class, type, collection = null, category = null }) {
        /** Something like ActiveEffect
         * @type {class} 
         */
        this.document_class = document_class;

        /** @type {string} */
        this.type = type;
        /** @type {Collection | null} */
        this.collection = collection;
        /** @type {string | null} */
        this.category = category;
    }

    /**
     * Returns true iff this drag area services the same collection as another (e.x. same actor)
     * Assumes that you do not have any duplicate categorical lists for the same collection
     * @param {DragArea} other_meta
     * @returns {boolean}
     */
    sameCollection(other_meta) {
        return this.document_class == other_meta.document_class && this.collection == other_meta.collection;
    }

    /**
     * Returns true iff this is the same list as another list.
     * Assumes that you do not have any duplicate categorical lists for the same collection
     * @param {DragArea} other_meta
     * @returns {boolean}
     */
    same(other_meta) {
        return (
            this.sameCollection(other_meta) &&
            this.category == other_meta.category
        );
    }


}

/** Eventually we'll use this and just abstract away everything else
  *   async updateEmbeddedDocuments(embeddedName, updates=[], operation={}) {
        operation.parent = this;
        operation.pack = this.pack;
        const cls = getDocumentClass(embeddedName);
        return cls.updateDocuments(updates, operation);
    }
  */

/**
 * Persist the sort of the given documents.
 * Note: Will break sort in other lists that don't include these documents i guess
 * @param {class} documentClass 
 * @param {Document[]} documents 
 * @param {({
 *   parent: Optional<Document>,
 *   pack: Optional<any>
 * })} options 
 */
export async function persistSort(documentClass, documents, options = { parent: null, pack: null }) {
    let updates = documents.map((doc, index) => {
        return {
            _id: doc.id,
            sort: index * 100,
        };
    });
    await documentClass.updateDocuments(updates, options);
};



/**
 * A useful aggregate type for our from/to callbacks
 * @typedef {object} DragItem
 * @property {string} id The dnd id. Most often the document id
 * @property {Document} doc The item being dragged
 * @property {DragArea} origin The drag area it is coming from
 */

/**
 * A useful aggregate type for our from/to callbacks. Effectively the same as DragState
 * @typedef {object} DragStateSnapshot
 * @property {DragItem} item The dragged item
 * @property {DragArea} dest_area Area the item was just dropped in
 * })}
 */

/**
 * When considering a drag, do we allow it? Must be synchronous
 * @typedef {(item: DragItem) => boolean}  AllowDropCallback
 */

/**
 * When a document is dragged from this document list, perform some actions upon it, such as deleting
 * Only called when dragging to a DIFFERENT area (For now???)
 * @typedef {(state: DragStateSnapshot, items: DragItem[]) => (void | Promise<void>)}  DragFromCallback
 */

/**
 * When a document is dragged to this document list, perform some actions upon it, such as persisting a new document to foundry, or persisting a sort, or whatever
 * We do nothing of this ourselves.
 * @typedef {(state: DragStateSnapshot, items: DragItem[]) => (void | Promise<void>)}  DragToCallback
 */


class DragState {
    /** @type {DragItem | null} */
    item = $state(null);

    /** Set during droppedIntoZone. Only cleaned up when a new dragged starts
     * @type {DragArea} 
     */
    dest_area = $state(null);


    /** @type {boolean} */
    dragging = $derived(this.item != null);

    /**
     * A non-reactive snapshot of the current state
     * @type {DragStateSnapshot}
     */
    get snapshot() {
        return {
            dest_area: this.dest_area,
            item: this.item
        }
    }

    /**
     * @param {DragItem} item 
     */
    setItem(item) {
        if(!item) console.warn("Set item to null - be sure you have provided a DragItem!")
        this.item = item;
    }

    /**
     * @param {DragArea} area 
     */
    setArea(area) {
        if(!area) console.warn("Set area to null - be sure you have provided a DragArea!")
        this.dest_area = area;
    }

    clear() {
        this.dragged = null;
        this.dest_area = null
    }
}

export const DRAG_STATE = new DragState();


// Order seems to be:
// Always first:                            consider:dragStarted        (called on original)
// Then:                                    finalize:droppedIntoZone    (called on whichever its dropped into)
// Then, if dropped into another zone:      finalize:droppedIntoAnother (called on original IFF dropped into another zone)
// Thus logically:
// - Always set drag state when consider dragStarted
// - Conditionally clear drag state if droppedIntoZone on the same zone
// - Always clear drag state if droppedIntoAnother



// We don't yet handle keyboard so, DRAG_STOPPED isn't handled