<script>
    import loc from "../../../../utils/localize";
    import { stop } from "../../../../utils/handlers";
    import UpdateInput from "../../../fields/UpdateInput.svelte";
    import { PopoutEditor } from "../../../../apps/popout_editor";

    let { actor, edit } = $props();

    let editor = null;
    function openEditor() {
        editor ??= new PopoutEditor(loc("animon.sheet.kid.type.edit"), actor, "system.kid_type_feature");
        editor.render({ force: true });
    }
</script>

<div class="inner-box kid-type-box">
    <div class="header prefix-input">
        <label for="system.stamina">{loc("animon.sheet.kid.type.title")}</label>
        <UpdateInput doc={actor} path="system.kid_type" size="1"></UpdateInput>
    </div>
    <div class="body">
        <div class="content">
            {@html actor.system.kid_type_feature ?? loc("animon.sheet.kid.type.placeholder")}
        </div>
        <button class="edit" onclick={(e) => [stop(e), openEditor()]}>
            <i class="fas fa-edit"></i>
        </button>
    </div>
</div>

<style lang="scss" module>
    .kid-type-box {
        display: flex;
        flex-direction: column;
    }

    .body {
        display: flex;
        flex-direction: row;
        align-items: center;
        .content {
            flex: 1 0;
        }
        .edit {
            flex: 0 1;
        }
    }
</style>
