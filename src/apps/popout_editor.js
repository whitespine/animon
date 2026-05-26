import { GenericComponentApp } from "./generic_app";
import ProseMirrorField from "../components/fields/ProsemirrorField.svelte";

export class PopoutEditor extends GenericComponentApp {
    static DEFAULT_OPTIONS = {
        classes: ["editor"],
        window: {
            title: "Edit",
            resizable: true
        },
        position: {
            width: 600,
            height: 400
        }
    }

    constructor(title, doc, path, options = {}) {
        let props = {
            doc,
            path,
            style: 'height: 100%'
        };
        options.window ??= {};
        options.window.title ??= title ?? undefined;
        super(ProseMirrorField, props, options);
    }
}