<script>
    import loc from "../../../utils/localize";
    import UpdateInput from "../../fields/UpdateInput.svelte";
    import XofX from "../../fields/XofX.svelte";
    import XP from "./components/XP.svelte";
    import { stop } from "../../../utils/handlers";
    import { slide } from "svelte/transition";

    let { mon, kid, edit } = $props();
</script>

{#if kid != null}
    <div class="outer-box bond-box col">
        <div class="inner-box row even">
            <label for="system">{loc("animon.sheet.bond.level")}</label>
            <UpdateInput
                class="nude"
                doc={kid}
                path="system.bond_level"
                style="text-align: center"
                size=1
            ></UpdateInput>
        </div>

        <div class="row">
            <div class="inner-box xp-col">
                <XP actor={kid} {edit}></XP>
            </div>
            <div class="col even box-col">
                <div class="bond-points">
                    <XofX
                        doc={kid}
                        label={loc("animon.sheet.bond.points")}
                        value_path="system.bond_points.value"
                        max_path="system.bond_points.max"
                    ></XofX>
                </div>

                <div class="bond-strain">
                    <XofX
                        doc={kid}
                        label={loc("animon.sheet.bond.strain")}
                        value_path="system.bond_strain.value"
                        max_path="system.bond_strain.max"
                    ></XofX>
                </div>

                {#if mon != null}
                    <div class="sig-uses">
                        <XofX
                            doc={mon}
                            label={loc(
                                "animon.sheet.animon.signature.use_label",
                            )}
                            value_path="system.signature_uses.value"
                            max_path="system.signature_uses.max"
                        ></XofX>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{:else}
    <div class="inner-box bondless-box">
        <p>{loc("animon.sheet.bond.missing_kid")}</p>
    </div>
{/if}

<style lang="scss" module>
    .bondless-box,
    .bond-box {
        --col1: 50px;
        --col2: 100px;
        --padding: 10px;
        max-width: fit-content;
    }
</style>
