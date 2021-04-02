<script>

    export let res

</script>

<div>
    <p>{res.body.message ? res.body.message : res.body.error}</p>
</div>

<style>
    div {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background-color: antiquewhite;
        border: 1px solid gray;
        border-radius: 3px;
        padding: 5px 20px;
    }
</style>