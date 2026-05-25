<script>
    import Harm from "./components/Harm.svelte";
    import Header from "./components/Header.svelte";
    import KidType from "./components/KidType.svelte";
    import Relationships from "./components/Relationships.svelte";
    import Stamina from "./components/Stamina.svelte";
    import Stuff from "./components/Stuff.svelte";
    import Talents from "./components/Talents.svelte";
    import Traits from "./components/Traits.svelte";

    let { actor, edit } = $props();
</script>

<div class="main">
    <Header {actor} {edit}></Header>
    <div class="even">
        <div>
            <Traits {actor} {edit}></Traits>
            <Stamina {actor} {edit}></Stamina>
            <Harm {actor} {edit}></Harm>
            <Relationships {actor} {edit}></Relationships>
        </div>
        <div>
            <KidType {actor} {edit}></KidType>
            <Talents {actor} {edit}></Talents>
            <Stuff {actor} {edit}></Stuff>
        </div>
    </div>
</div>

<style lang="scss" module>
    .main {
        .columns {
            display: flex;
            flex-direction: row;
            > * {
                min-width: none;
                flex: 1 0; 

                display: flex;
                flex-direction: column;
            }
        }
    }
</style>
