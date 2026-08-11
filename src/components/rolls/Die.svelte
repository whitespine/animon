<script lang="ts">
    import { fixClasses } from "../../utils/classes";
    let {
        value,
        discarded,
        class: className = "",
        ...restProps
    }: {
        value: number;
        discarded?: boolean;
        class?: string | string[] | Record<string, any>;
    } & Record<string, any> = $props();
    let fullClasses = $derived.by(() => {
        return {
            discarded: !!discarded,
            ...fixClasses(className),
        };
    });
</script>

<div {...restProps} class={fullClasses}>{value}</div>

<style lang="scss">
    div {
        --true-size: var(--die-size, 32px);
        border: 0px;
        width: var(--true-size);
        height: var(--true-size);
        margin: var(--margin, 2px);
        border-radius: calc(var(--true-size) / 6);
        background-color: gray;
        text-align: center;
        font-size: calc(var(--true-size) * 0.8);
    }
    .discarded {
        opacity: 33%;
    }
</style>
