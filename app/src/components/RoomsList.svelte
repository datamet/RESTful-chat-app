<script>
    import { room } from '../stores/activeRoom.js'
    import { getContext, onMount, onDestroy } from 'svelte'
    import { user } from '../stores/auth.js'
    import Button from './Button.svelte'
    import HomeIcon from '../assets/home.svelte'

    const client = getContext('client')
    let joinedRooms = []
    let otherRooms = []
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
        }
        else createRoomError = res.body.error
    }

    const viewRoom = async (roomID) => {
        selected = roomID
        const res = await client.getRoom(roomID)
        if (res.body.room) room.set(res.body.room)
        else room.set(null)
    }

    const updateRooms = (res) => {
        if (res.body.rooms) {
            const joined = []
            const other = []
            for (const room of res.body.rooms) {
                if (room.joined) joined.push(room)
                else other.push(room)
                console.log(room.id, selected)
            }
            joinedRooms = joined
            otherRooms = other
        }
    }

    const getRooms = async () => {
        const res = await client.getRooms()
        updateRooms(res)
        // if (selected) {
        //     const res = await client.getRoom(roomID)
        //     if (res.body.room) room.set(res.body.room)
        //     else room.set(null)
        // }
    }

    let stopUpdate
    onMount(() => {
        stopUpdate = client.fresh.add(3000, () => client.getRooms(), updateRooms)
    })

    onDestroy(() => {
        stopUpdate()
    })

    room.subscribe(() => getRooms())
</script>

<div class="joined-rooms">
    <p class="title">Joined rooms:</p>
    {#if joinedRooms.length > 0}
        {#each joinedRooms as room (room.id)}
            <button class="room-button" on:click={() => viewRoom(room.id)}>
                <div class="room {room.id === selected ? 'selected' : ''}">
                    <div class="room-title">
                        <HomeIcon />
                        <h3 class="room-name">{room.name}</h3>
                    </div>
                </div>
            </button>
        {/each}
    {:else}
        <p class="placeholder">You haven't joined any rooms</p>
    {/if}
</div>
<div class="otherRooms">
    <p class="title">Other rooms:</p>
    {#if otherRooms.length > 0}
        {#each otherRooms as room (room.id)}
            <div class="room">
                <div class="room-title">
                    <HomeIcon />
                    <h3 class="room-name">{room.name}</h3>
                </div>
                <button class="room-action" on:click={() => joinRoom(room.id, $user)}>Join</button>
            </div>
        {/each}
    {:else}
        <p class="placeholder">There are no rooms you haven't joined</p>
    {/if}
</div>
<div class="new-room">
    <div>
        <label for="room-name">New room name:</label>
        <input type="text" id="room-name" bind:value={newRoomName}>
        <p class="error">{createRoomError}</p>
    </div>
    <Button action={createRoom}>Create Room +</Button>
</div>

<style>
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

    .placeholder {
        color: gray;
    }
</style>