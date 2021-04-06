<script>
    export let action = () => {}
</script>

<button on:click={action}><slot/></button>

<style>
    button {
        line-height: 2.7rem;
        font-size: 1.5rem;
        border-radius: .3rem;
        background-color: rgb(60, 133, 216);
        color: white;
        border: none;
        padding: .5rem 1.4rem;
    }
</style>