<script>
    import { resolveDotpath } from "../../utils/paths";

    // This thing is WIP and not actually functional yet

    let { doc, path } = $props();
    let content = $derived(resolveDotpath(doc, path));

    function save(e) {
        doc.update({ [path]: e.target.value });
    }
</script>

<!-- <div class="editor" {@attach editorAttachment}></div>-->
<prose-mirror
    value={content}
    onsave={save}
    onclose={close}
    collaborate
    data-document-uuid={doc.uuid}
    name={path}
></prose-mirror>
