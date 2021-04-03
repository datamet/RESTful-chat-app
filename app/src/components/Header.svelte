<script>
	import { room } from '../stores/activeRoom.js'
    import ChatIcon from '../assets/chat.svelte'
    import DropdownForm from './DropdownForm.svelte'
    import { auth } from '../stores/auth.js'
    import { getContext } from 'svelte'
    import Button from './Button.svelte'
    import Userinfo from './Userinfo.svelte'

    const client = getContext('client')

    const logout = async () => {
        const res = await client.logout($auth)
    }

</script>

<header>

    <div class="logo">
        <ChatIcon />
        <h1>ChatApp</h1>
    </div>

    <div class="room-title">
        <h2>{ $room ? $room.name : '' }</h2>
    </div>

    <nav>
        <ul>
            {#if !$auth}
                <li><DropdownForm action="Login" /></li>
                <li><DropdownForm action="Register"/></li>
            {:else}
                <li><Userinfo /></li>
                <li><Button action={logout}>Logout</Button></li>
            {/if}
        </ul>
    </nav>

</header>

<style>
    header {
        background-color: #EFEFEF;
        padding: 0 2rem;
        height: 6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 1000;
        position: relative;
        box-shadow: 0 0 1rem 0 lightgray;
    }

    h1 {
        margin: 0;
        font-size: 2.4rem;
        letter-spacing: .01em;
    }

    h2 {
        font-size: 1.7rem;
        font-weight: 400;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    ul {
        display: flex;
        align-items: center;
        list-style-type: none;
        margin: 0;
        padding: 0;
        gap: 2rem;
    }
</style>