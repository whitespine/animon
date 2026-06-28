<script>
    import { reactive } from "../../../utils/attach.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    
    let { context, app } = $props();
    let gear = $derived(context.item);
    let edit = $derived(app.isEditable);
</script>

<div class="row center">
    <div>
        <Portrait
            height="128px"
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
