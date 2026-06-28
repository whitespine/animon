<script>
    import loc from "../../../../utils/localize";
    import { stop } from "../../../../utils/handlers";
    
    import { PopoutEditor } from "../../../../apps/popout_editor";
    import { reactive } from "../../../../utils/attach.svelte";

    let { actor, edit } = $props();

    let editor = null;
    function openEditor() {
        editor ??= new PopoutEditor(loc("animon.sheet.kid.type.edit"), actor, "system.kid_type_feature");
        editor.render({ force: true });
    }
</script>

<div class="inner-box kid-type-box col">
    <div class="header prefix-input">
        <label for="system.stamina">{loc("animon.sheet.kid.type.title")}:</label>
        <input {@attach reactive(actor, "system.kid_type")} size="1">
    </div>
    <div class="body row center">
        <div class="content">
            {@html actor.system.kid_type_feature ?? loc("animon.sheet.kid.type.placeholder")}
        </div>
        <button class="edit" onclick={(e) => [stop(e), openEditor()]} title="edit">
            <i class="fas fa-edit"></i>
        </button>
    </div>
</div>

<style lang="scss">
    .content {
        flex-grow: 1;
        flex-basis: 1;
    }
    .content {
        flex-grow: 0;
        flex-basis: 1;
    }
</style>
