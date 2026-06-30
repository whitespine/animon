<script>
    import { ELEMENTS } from "../../models/actors/actor.svelte";
    import loc from "../../utils/localize";
    import Select from "./Select.svelte";
    let { ...restProps } = $props();

    let elements = ELEMENTS.map((e) => ({
        id: e,
        label: loc(`animon.elements.${e}`),
    }));
</script>

<Select {...restProps} options={elements}></Select>
