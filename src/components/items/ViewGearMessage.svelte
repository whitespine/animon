<script>
    import GearDisplay from "./ViewGear.svelte";

    let { message } = $props();

    /** @import { ShowGearMessageData } from "../../utils/roll.svelte" */

    /** @type {ShowGearMessageData} */
    let roll_data = $derived(message.animon);

    let item = $derived(foundry.utils.fromUuid(roll_data.item));
</script>

{#await item}
    <span>...</span>
{:then resolved_item} 
    <GearDisplay item={resolved_item} edit=false />
{:catch}
    <span>ITEM MISSING</span>
{/await}
