<script>
    import Die from "./Die.svelte";
    import { onMount, onDestroy } from "svelte";

    let props = $props();
    let value = $state(1);
    let interval;

    onMount(() => {
        interval = setInterval(() => {
            let new_value = Math.ceil(Math.random() * 6);
            if(new_value == value) {
                new_value = (value % 6) + 1;
            }
            value = new_value;
        }, 100);
    });

    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
        }
    });
</script>

<Die {value} {...props} />
