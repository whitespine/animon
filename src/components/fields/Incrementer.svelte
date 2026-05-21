<script>
    let {
        value = $bindable(),
        min = undefined,
        max = undefined,
        name = undefined,
        width = "140px",
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

<div {...restProps} style:min-width={width} style:max-width={width}> 
    <button onclick={(e) => increment(e, -1)}>-</button>
    <input
        type="number"
        {min}
        {max}
        {name}
        bind:value
    />
    <button class="invert" onclick={(e) => increment(e, 1)}>+</button>
</div>

<style lang="scss">
    div {
        display: flex;
        height: 100%;
        align-items: center;
        input {
            margin: 5px;
            text-align: center;
            flex-grow: 1;
            flex-basis: 1;
            font-size: x-large;
        }

        button {
            --button-size: 1.5em;
            font-size: x-large;
            flex-basis: 0;
            width: 1.5em;
            padding: 15px;
            min-height: none;
            min-width: none;
        }
    }
</style>
