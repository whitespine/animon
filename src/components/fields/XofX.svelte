<script>
    import { stop } from "../../utils/handlers";
    import { resolveDotpath } from "../../utils/paths";
    import Breaker from "../layout/Breaker.svelte";
    import UpdateInput from "./UpdateInput.svelte";
    let { doc, label, value_path, max_path } = $props();
    let max = $derived(resolveDotpath(doc, max_path, 0));
</script>

<div class="xofx inner-box center col">
    <label for={value_path}><Breaker text={label}></Breaker></label>
    <div class="body">
        <div class="numerator"><UpdateInput class="nude" {doc} path={value_path} size=1></UpdateInput></div>
        <div class="denominator">{max}</div>
    </div>
</div>

<style lang="scss">
    .xofx {
        --width: 60px;
        --inset: 10px;

        label {
            text-align: center;
            border-bottom: solid grey 1px;
        }

        .body {
            display: inline-grid;
        }

        .denominator {
            grid-column: 2;
            grid-row: 2;
        }

        .numerator {
            position: relative;
        }

        .numerator:after {
            content: "";
            position: absolute;
            left: 75%;
            /* Give top and bottom the same value*/
            top: 0%;
            bottom: -100%;
            width: 3px;
            background: black;
            transform: rotate(45deg); /* Adjust this like you want */
        }
    }
</style>
