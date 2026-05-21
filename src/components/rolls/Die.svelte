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

<span {...restProps} class={fullClasses} alt={value}> {value} </span>

<style lang="scss">
    span {
        border: 0px;
        width: 32px;
        height: 32px;
        background-color: gray;
        text-align: center;
        font-size: x-large;
    }
    .discarded {
        opacity: 33%;
    }
</style>
