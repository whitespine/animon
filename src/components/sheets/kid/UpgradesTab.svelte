<script>
    import loc from "../../../utils/localize";

    let { actor, edit } = $props();
    let items = $derived(actor.system.sv_items);
    let upgrades = $derived(items.filter(i => i.type == "upgrade"))
</script>

<div class="upgrades inner-box">
    <h3>{loc("animon.sheet.tab.upgrades")}</h3>
</div>

<style lang="scss" module>
    .notes {
        padding: 8px;
    }
</style>
