<script>
    import { getContext } from 'svelte'
    import { fade } from 'svelte/transition'
    import Cross from '../assets/cross.svelte'
    import Button from './Button.svelte'

    export let action = 'Register'
    let open = false, error = ''
    let username, password
    let client = getContext('client')

    const login = async () => {
        const res = await client.login(username, password)
        return res
    }

    const register = async () => {
        const res = await client.register(username, password)
        if (res.body.message) login()
        return res
    }


    const submit = async () => {
        const func = action === 'Register' ? register : login
        let res = await func()
        if (res.body.error) error = res.body.error
        if (res.body.message) {
            open = false
            error = ''
            username = ''
            password = ''
        }
    }
</script>

<div class="dropdown">
    <Button action={() => open = true}>{action}</Button>
    {#if open}
        <div class="background" on:click={() => open = false} in:fade={{duration:200}} out:fade={{duration:200}}>
            <div class="modal" on:click|stopPropagation>
                <button on:click={() => open = false} class="cross"><Cross /></button>
                <h3>{action}</h3>
                <form on:submit|preventDefault class="form">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input id="username" type="text" bind:value={username}>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input id="password" type="password" bind:value={password}>
                    </div>
                    <div class="error">
                        <p>{error}</p>
                    </div>
                    <Button action={submit}>{action}</Button>
                </form>
            </div>
        </div>
    {/if}
</div>

<style>
    .form {
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
    }

    .dropdown {
        position: relative;
    }

    .background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, .1);
        backdrop-filter: blur(10px);
    }

    .modal {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color: white;
        border: 1px solid lightgray;
        border-radius: .5rem;
        padding: 6rem 3.5rem 3rem 3.5rem;
        width: 50rem;
        max-width: 100%;
    }

    .cross {
        background-color: transparent;
        border: none;
        margin: 0;
        padding: 0;
        position: absolute;
        right: 3.5rem;
        top: 3rem;
        width: 2rem;
    }

    .error {
        color: rgb(180, 47, 47);
    }
</style>