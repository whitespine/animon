<script>
    import { reactive } from "../../utils/attach.svelte";
    import { resolveDotpath } from "../../utils/paths";
    import Breaker from "../layout/Breaker.svelte";

    let { doc, label, value_path, max_path } = $props();
    let max = $derived(resolveDotpath(doc, max_path, 0));
</script>

<div class="xofx inner-box center col">
    <label for={value_path}><Breaker text={label}></Breaker></label>
    <div class="body">
        <div class="numerator">
            <input {@attach reactive(doc, value_path)} class="nude" size="1" />
        </div>
        <div class="denominator">{max}</div>
    </div>
</div>

<style lang="scss">
    .xofx {
        --cell: 1.5rem;
        --slash-width: 2px;
        --slash-fade: 1px;

        label {
            text-align: center;
            border-bottom: solid grey 1px;
        }

        .body {
            display: grid;
            grid-template-columns: var(--cell) var(--cell);
            grid-template-rows: var(--cell) var(--cell);

            background: linear-gradient(
                to top left,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0) calc(50% - var(--slash-width)),
                rgba(0, 0, 0, 1)
                    calc(50% - var(--slash-width) + var(--slash-fade)),
                rgba(0, 0, 0, 1) 50%,
                rgba(0, 0, 0, 1)
                    calc(50% + var(--slash-width) - var(--slash-fade)),
                rgba(0, 0, 0, 0) calc(50% + var(--slash-width)),
                rgba(0, 0, 0, 0) 100%
            );
        }

        .denominator {
            grid-column: 2;
            grid-row: 2;
        }

        .numerator {
            grid-column: 1;
            grid-row: 1;
        }

        input,
        span {
            justify-self: center;
            align-self: center;
            text-align: center;
            width: 100%;
            height: 100%;
        }

        .slash {
            grid-column: 1 / 3;
            grid-row: 1 / 3;
            background: black;
            justify-self: center;
            height: 100%;
            width: var(--slash-width);
            transform: rotate(45deg);
        }
    }
</style>
