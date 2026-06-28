<script>
    let {
        value = $bindable(),
        min = undefined,
        max = undefined,
        name = undefined,
        width = "140px",
        class: class_ = "row even center center-text",
        ...restProps
    } = $props();

    function increment(e, delta) {
        e.preventDefault();
        e.stopPropagation();
        let new_value = value + delta;
        if (min != undefined) {
            new_value = Math.max(min, new_value);
        }
        if (max != undefined) {
            new_value = Math.min(max, new_value);
        }
        value = new_value;
    }
</script>

<div {...restProps} class={class_ + " incrementer"}> 
    <button onclick={(e) => increment(e, -1)}>-</button>
    <input
        type="number"
        {min}
        {max}
        {name}
        bind:value
        size="1"
    />
    <button class="invert" onclick={(e) => increment(e, 1)}>+</button>
</div>

<style lang="scss">
    .incrementer {
        input {
            margin: 1px 2px;
            text-align: center;
            font-size: large;
            padding: 0px;
            height: 100%;
        }

        button {
            --button-size: 100%;
            font-size: x-large;
        }
    }
</style>
