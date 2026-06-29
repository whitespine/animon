<script>
    import {tick} from "svelte";
    import { fixClasses, fixStyle } from "../../utils/classes";
    import { buildListenerAttacher, portalTo } from "../../utils/attach.svelte";
    import { ElementRect } from "runed";

    let {
        on,
        tip,
        showDelay = 200,
        showFadeTime = 200,
        hideFadeTime = 200,
        spacing = "10px",
        side = "left"
    } = $props();

    /** @type {ReturnType<typeof setTimeout> | null} */
    let hover_timeout = null;
    /** @type {ReturnType<typeof setTimeout> | null} */
    let unhover_timeout = null;

    // Kept in constant sync with whether our mouse is in the popover control anchor
    let is_hovered = $state(false);

    // This is whether the popover is actually currently visible or not
    let visible = $state(false);

    // Our anchor ref. We only support one anchor at a time
    let anchor = $state();
    let tooltip = $state();
    const default_siding = {
        left: undefined,
        right: undefined,
        top: undefined,
        bottom: undefined
    };
    let siding = $state({...default_siding});

    function fixSiding() {
        let anchor_rect = anchor.getBoundingClientRect();
        let tt_rect = tooltip.getBoundingClientRect();
        let avg = (...args) => args.reduce((a, b) => a + b, 0) / args.length;
        if(side == "right") {
            siding = {
                ...default_siding,
                top: `${avg(anchor_rect.bottom, anchor_rect.top) + tt_rect.height / 2}px`,
                left: `calc(${anchor_rect.right}px + ${spacing})`
            };
        } else if(side == "left") {
            siding = {
                ...default_siding,
                top: `${avg(anchor_rect.bottom, anchor_rect.top) - tt_rect.height / 2}px`,
                right: `calc(100% - ${anchor_rect.left}px + ${spacing})`
            };
        } else if(side == "top") {
            siding = {
                ...default_siding
            };
        } else if(side == "bottom") {
            siding = {
                ...default_siding
            };
        }
    }

    const mountListeners = buildListenerAttacher({
        on: (elt) => {
            anchor = elt;
        },
        mouseenter: () => {
            is_hovered = true;
            if (unhover_timeout) {
                clearTimeout(unhover_timeout);
                unhover_timeout = null;
            }
            if (hover_timeout) {
                return;
            } else {
                hover_timeout = setTimeout(() => {
                    hover_timeout = null;
                    if (is_hovered && !visible) {
                        visible = true;
                        // Also set a tiemout to fix siding once 
                        tick().then(fixSiding);
                    }
                }, showDelay);
            }
        },
        mouseleave: () => {
            is_hovered = false;
            unhover_timeout = setTimeout(() => {
                unhover_timeout = null;
                if (visible) {
                    visible = false;
                }
            }, hideFadeTime);
        },
    });
</script>

{#if visible}
    <div
        bind:this={tooltip}
        class={fixClasses("animon tooltip", {
            "fade-in": is_hovered,
            "fade-out": !is_hovered,
        })}
        {@attach portalTo(document.body)}
        style:--fade-in-time="{showFadeTime}ms"
        style:--fade-out-time="{hideFadeTime}ms"
        style:left={siding.left}
        style:right={siding.right}
        style:top={siding.top}
        style:bottom={siding.bottom}
    >
        {@render tip?.()}
    </div>
{/if}

{@render on?.(mountListeners)}

<style lang="scss">
    .tooltip {
        position: fixed;
        background: transparent;
        border: none;
        pointer-events: none;

        z-index: 999999;
    }
</style>
