
<script>
    import { stop } from "../../../utils/handlers";
    import loc from "../../../utils/localize";
    import { RollerState } from "./roller_state.svelte";

    let {
        value = $bindable() 
    } = $props();

    function select(e) {
        stop(e);
        value = Number.parseInt(e.target.dataset.val);
    }
</script>

<div class="row even buttons">
    {#each {length: 5} as _, i }
        {const val = i - 2}
        <div class={{active: value == val}}>
            <button data-val={val} title={loc(`animon.boost.${val}`)} onclick={select}>
                {{
                    "-2": "--",
                    "-1": "-",
                    "0": "=",
                    "1": "+",
                    "2": "++",
                }[val]}
            </button>
        </div>
    {/each}
</div>

<style lang="scss">
    .buttons {
        --inset: 10px;
        --close-inset: var(--inset);
        --far-inset: calc(100% - var(--inset));
        --gap: 2px;
        --red: 19;
        --green: 229;
        --beige: 110;
        --fullsat: 100%;
        --halfsat: 50%;
        --nullsat: 10%;
        --brightness: 50%;

        --lchev: polygon(100% 0%, var(--far-inset) 50%, 100% 100%, var(--close-inset) 100%, 0% 50%, var(--close-inset) 0%);
        --lhalfchev: polygon(var(--close-inset) 0%, 100% 0%, 100% 100%, var(--close-inset) 100%, 0% 50%);
        --rhalfchev: polygon(0% 0%, var(--far-inset) 0%, 100% 50%, var(--far-inset) 100%, 0% 100%);
        --rchev: polygon(0% 0%, var(--far-inset) 0%, 100% 50%, var(--far-inset) 100%, 0% 100%, var(--close-inset) 50%);

        button {
            color: black;
            border-radius: 0;
            border: none;
            min-width: unset;
            font-size: larger;
            width: 100%;
            height: 100%;
        }

        div {
            background-color: unset;
            padding: var(--gap);

            &.active {
                background-color: var(--color-warm-1);
                opacity: 100%;
                z-index: 10;
            }
        }

        div:nth-child(1) {
            margin-right: calc(-1 * var(--inset) - var(--gap));
            clip-path: var(--lchev);

            button {
                clip-path: var(--lchev);
                background-color: hsl(var(--red), var(--fullsat), var(--brightness));
            }
        }
        div:nth-child(2) {
            clip-path: var(--lhalfchev);
            margin-right: calc(-1*var(--gap));
            button {
                clip-path: var(--lhalfchev);
                background-color: hsl(var(--red), var(--halfsat), var(--brightness));
            }
        }
        div:nth-child(3) {
            button {
                background-color: hsl(var(--beige), var(--nullsat), var(--brightness));
            }
        }
        div:nth-child(4) {
            clip-path: var(--rhalfchev);
            margin-left: calc(-1*var(--gap));
            button {
                clip-path: var(--rhalfchev);
                background-color: hsl(var(--green), var(--halfsat), var(--brightness));
            }
        }
        div:nth-child(5) {
            clip-path: var(--rchev);
            margin-left: calc(-1 * var(--inset) - var(--gap));
            button {
                clip-path: var(--rchev);
                background-color: hsl(var(--green), var(--fullsat), var(--brightness));
            }
        }
    }
</style>
