<script>
import { loop_guard } from "svelte/internal";


import Login from "./Login.svelte";


    import { getContext } from "svelte";
    import Info from '../components/Info.svelte'

    let client = getContext('client')

    let username, password, res
    
    const register = async () => {
        const response = await client.register(username, password)
        console.log(response)
        res = response
    }
</script>

<div>
    {#if res}
        <Info {res} />
    {/if}
    <div>
        <label for="username">Username:</label>
        <input id="username" type="text" bind:value={username}>
    </div>
    <div>
        <label for="password">Password:</label>
        <input id="password" type="password" bind:value={password}>
    </div>

    <button on:click={register}>Register</button>
</div>
