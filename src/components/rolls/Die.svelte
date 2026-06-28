<script>
    import { fixClasses } from "../../utils/classes";
    let { value, discarded, class: className, ...restProps } = $props();
    let fullClasses = $derived.by(() => {
        return {
            discarded: !!discarded,
            ...fixClasses(className),
        };
    });
</script>

<div {...restProps} class={fullClasses} alt={value}> {value} </div>

<style lang="scss">
    div {
        --true-size: var(--size, 32px);
        border: 0px;
        width: var(--true-size);
        height: var(--true-size);
        margin: var(--margin, 2px);
        border-radius: calc(var(--true-size) / 6);
        background-color: gray;
        text-align: center;
        font-size: x-large;
    }
    .discarded {
        opacity: 33%;
    }
</style>
