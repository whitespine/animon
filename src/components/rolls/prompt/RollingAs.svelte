<script>
    import { RollerState } from "./roller_state.svelte";
    import { ControlState } from "../../../utils/control.svelte";

    /**
     * @type {{state: RollerState}}
     */
    let { state = null } = $props();
</script>

<div class="row even center">
    <span class="pseudo-label">Rolling As:</span>
    <span class="pseudo-label">{state.speaker.alias}</span> 
</div>

<style lang="scss">
</style>
