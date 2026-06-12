<script>
    import { fixClasses } from "../../utils/classes";
    import { buildListenerAttacher, portalTo } from "../../utils/attach";

    let {
        on,
        tip,
        showDelay = 200,
        showFadeTime = 200,
        hideFadeTime = 200,
    } = $props();

    // In maybe two years, make this use popovers so we don't need to use portals

    const id = foundry.utils.randomID();
    const anchorID = `--anchor-${id}`;

    // let tooltip;

    /** @type {ReturnType<typeof setTimeout> | null} */
    let hover_timeout = null;
    /** @type {ReturnType<typeof setTimeout> | null} */
    let unhover_timeout = null;

    // Kept in constant sync with whether our mouse is in the popover control anchor
    let is_hovered = $state(false);

    // This is whether the popover is actually currently visible or not
    let visible = $state(false);

    const mountListeners = buildListenerAttacher({
        on: (elt) => {
            elt.style.anchorName = anchorID;
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
                    if (is_hovered && !visible) {
                        visible = true;
                        // tooltip.showPopover();
                    }
                    hover_timeout = null;
                }, showDelay);
            }
        },
        mouseleave: () => {
            is_hovered = false;
            unhover_timeout = setTimeout(() => {
                if (visible) {
                    visible = false;
                    // tooltip.hidePopover();
                }
            }, hideFadeTime);
        },
    });
</script>

{#if visible}
    <div
        // bind:this={tooltip}
        // popover="manual"
        class={fixClasses("animon tooltip", {
            "fade-in": is_hovered,
            "fade-out": !is_hovered,
        })}
        // {@attach portalTo(document.body)}
        style="--fade-in-time={showFadeTime}; --fade-out-time={hideFadeTime}; position-anchor: {anchorID}"
    >
        {@render tip?.()}
    </div>
{/if}

<div>
    {@render on?.(mountListeners)}
</div>

<style lang="scss">
    .tooltip {
        --fade-in-time: 200ms;
        --fade-out-time: 200ms; // keep in sync with TOOLTIP_DISAPPEAR_DELAY_MS

        position: absolute;
        // position-area: right;
        left: anchor(right);
        align-self: anchor-center;
        margin-left: 10px;

        // position-anchor: --foo;
        // left: anchor(right);
        // margin-left: 20px;
    }
</style>
