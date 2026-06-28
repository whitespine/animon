<script>
    import { stop } from "../../utils/handlers";
    import { resolveDotpath } from "../../utils/paths";
    import Breaker from "../layout/Breaker.svelte";
    
    let { doc, label, path } = $props();
    let value = $derived(resolveDotpath(doc, path, 0));
</script>

<div class="stat-box inner-box center col">
    <h4 class="header"><Breaker text={label}></Breaker></h4>
    <div class="grow row center">
        {value}
    </div>
</div>

<style lang="scss">
    .stat-box {
        .header {
            text-align: center;
            border-bottom: solid grey 1px;
        }
    }
</style>
