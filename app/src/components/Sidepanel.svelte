<script>
    import { getContext, onMount } from 'svelte'
    import { auth, user } from '../stores/auth.js'

    const client = getContext('client')
    let rooms = []
    let selected = ''

    const joinRoom = async (roomID, userID) => {
        const res = await client.joinRoom(roomID, userID)
        if (res.body.message) getRooms()
    }

    const leaveRoom = (roomID, userID) => {

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
        {#each rooms as room (room.id)}
            <button class="room-button" on:click={() => viewRoom(room)}>
                <div class="room {room.id === selected ? 'selected' : ''}">
                    <h3 class="room-name">{room.name}</h3>
                    {#if !room.joined}
                        <button class="room-action" on:click={() => joinRoom(room.id, $user)}>Join</button>
                    {:else}
                        <button class="room-action" on:click={() => leaveRoom(room.id, $user)}>Leave</button>
                    {/if}
                </div>
            </button>
        {/each}
        <button class="create-room">Create Room +</button>
    {:else}
        <p>Log in to view rooms...</p>
    {/if}
</aside>

<style>
    aside {
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
        background-color: #EFEFEF;
        align-items: center;
        padding: 0 2rem;
        border-bottom: 1px solid lightgray;
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

    .selected {
        background-color: #3C85D8;
        color: white;
    }

    .create-room {
        background-color: #EFEFEF;
        color: #3C85D8;
        font-weight: 700;
        font-size: 1.6rem;
        height: 7rem;
        border: none;
        border-radius: 0;
        margin: 0;
        padding: 0 2rem;
        display: block;
        text-align: left;
        width: 100%;
    }

    .room-name {
        color: #333;
        font-size: 1.6rem;
    }

    button:focus {
        outline: none;
    }
</style>