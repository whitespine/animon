<script>
    import loc from "../../../../utils/localize";

    let { actor, edit } = $props();
    let items = $derived(actor.system.sv_items.filter(x => x.type != "upgrade"));
</script>

<div class="inner-box stuff-box">
    <h2>{loc("animon.sheet.kid.stuff.title")}</h2>
    <div class="stuff row">
        {#each items as item}
            <span class="item">{item.name}</span>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .stuff-box {
        text-align: center;

    }
    .stuff {
        flex-wrap: wrap;

        .item {
            border-radius: .5rem;
            background-color: green;
            margin-right: 5px;
            padding: 5px;
            color: black;
        }
    }
</style>
