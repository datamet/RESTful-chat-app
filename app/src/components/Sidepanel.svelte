<script>
    import { getContext, onMount } from 'svelte'
    import { auth, user } from '../stores/auth.js'
    import Button from './Button.svelte'
    import HomeIcon from '../assets/home.svelte'

    const client = getContext('client')
    let rooms = []
    let selected = ''
    let newRoomName
    let createRoomError = ''

    const joinRoom = async (roomID, userID) => {
        const res = await client.joinRoom(roomID, userID)
        if (res.body.message) getRooms()
    }

    const createRoom = async () => {
        const res = await client.createRoom(newRoomName)
        if (res.body.message) {
            createRoomError = ''
            newRoomName = ''
            getRooms()
        }
        else createRoomError = res.body.error
    }

    const viewRoom = (room) => {
        selected = room.id
    }

    const getRooms = async () => {
        const res = await client.getRooms()
        if (res.body.rooms) rooms = res.body.rooms
    }
    $: if($auth) getRooms()
    
</script>

<aside>
    {#if $auth}
        <div class="joined-rooms">
            <p class="title">Joined rooms:</p>
            {#each rooms as room (room.id)}
                {#if room.joined}
                    <button class="room-button" on:click={() => viewRoom(room)}>
                        <div class="room {room.id === selected ? 'selected' : ''}">
                            <div class="room-title">
                                <HomeIcon />
                                <h3 class="room-name">{room.name}</h3>
                            </div>
                        </div>
                    </button>
                {/if}
            {/each}
        </div>
        <div class="otherRooms">
            <p class="title">Other rooms:</p>
            {#each rooms as room (room.id)}
                {#if !room.joined}
                    <div class="room">
                        <div class="room-title">
                            <HomeIcon />
                            <h3 class="room-name">{room.name}</h3>
                        </div>
                        <button class="room-action" on:click={() => joinRoom(room.id, $user)}>Join</button>
                    </div>
                {/if}
            {/each}
        </div>
        <div class="new-room">
            <div>
                <label for="room-name">New room name:</label>
                <input type="text" id="room-name" bind:value={newRoomName}>
                <p class="error">{createRoomError}</p>
            </div>
            <Button action={createRoom}>Create Room +</Button>
        </div>
    {:else}
        <div class="login-message">
            <p>Log in to view rooms...</p>
        </div>
    {/if}
</aside>

<style>
    aside {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 34rem;
        background-color: rgb(243, 243, 243);
        overflow-y: scroll;
        box-shadow: 0 0 1rem 0 lightgray;
    }

    aside::-webkit-scrollbar {
        display: none;
    }

    .room {
        height: 7rem;
        display: flex;
        align-items: center;
        padding: 0 2rem;
        margin: .3rem 0;
        border-radius: .3rem;
        transition: all linear .2s;
        justify-content: space-between;
    }

    .room:hover {
        background-color: #dbdbdb;
    }

    .room-button {
        background-color: none;
        border: none;
        border-radius: 0;
        margin: 0;
        padding: 0;
        display: block;
        width: 100%;
    }

    .new-room {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .room-name {
        color: #333;
        padding-top: .2rem;
        font-size: 1.6rem;
    }

    .selected {
        background-color: #dbdbdb;
    }

    button:focus {
        outline: none;
    }

    .login-message {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .error {
        color: #a35353;
    }

    .room-title {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .room-action {
        border: none;
        background-color: #3C85D8;
        color: white;
        border-radius: .3rem;
        height: 2.5rem;
        padding: 0 1rem;
        display: none;
    }

    .room:hover .room-action {
        display: block;
    }
</style>