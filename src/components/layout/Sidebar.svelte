<script>
    import { stop } from "../../utils/handlers";
    import { fixClasses } from "../../utils/classes";
    import { slide } from "svelte/transition";

    let { children } = $props();
    let open = $state(false);

    function toggle(e) {
        stop(e);
        open = !open;
    }
</script>

<div class="anchor">
    <aside class="sidebar row center {open ? 'open' : 'closed'}">
        <!--<div class="body" transition:slide={{ axis: "x" }}>-->
        <div class="body">
                {@render children?.()}
        </div>
        <button class="control" title="control toggle bond box" onclick={toggle}>
            <i class="fas fa-arrow-{open ? 'left' : 'right'}"></i>
        </button>
    </aside>
</div>

<style lang="scss">
    .anchor {
        --control-width: 16px;
        position: relative;
        min-width: var(--control-width);
    }

    .sidebar {
        position: absolute;
        transition: all 0.3s ease-in-out;
        left: var(--control-width);

        &.closed {
            // right: calc(-1 * var(--control-width));
            transform: translateX(-100%);
        }

        &.open {
            transform: translateX(0%);
        }

        .control {
            max-width: var(--control-width);
            min-width: var(--control-width);
        }
    }
</style>
