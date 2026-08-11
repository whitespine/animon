<script lang="ts">
    import { reactive } from "../../../utils/attach.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    
    let { document: gear } = $props();
    let edit = $derived(app.isEditable);
</script>

<div class="row center">
    <div>
        <Portrait
            --portrait-size="128px"
            style="margin-left: auto; margin-right: auto"
            doc={gear}
            {edit}
        />
    </div>
    <div>
        <input {@attach reactive(gear, "name")} >
    </div>
</div>

<style lang="scss">


</style>
