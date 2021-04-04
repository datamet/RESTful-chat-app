<script>
    import SendIcon from '../assets/send.svelte'
    import { user } from '../stores/auth.js'
    import { getContext, onMount, onDestroy } from 'svelte'
    import { room } from '../stores/activeRoom.js'

    let messages = []
    let newMessage = ''
    let client = getContext('client')
    let stopFresh

    const getMessages = async () => {
        const res = await client.getMessages($room.id)
        if (res.body.messages) messages = res.body.messages
    }

    const freshMessages = async () => {
        const updateFeed = (res) => {
            if (res.body.messages) messages = res.body.messages
        }

        stopFresh = client.fresh(500, () => client.getMessages($room.id), updateFeed)
    }

    const sendMessage = async () => {
        const res = await client.postMessage($room.id, $user, newMessage)
        if (res.body.message) {
            newMessage = ''
            getMessages()
        }
    }

    const deleteRoom = async () => {
        const res = await client.deleteRoom($room.id)
        if (res.body.message) room.set(null)
    }

    onMount(() => {
        freshMessages()
    })

    onDestroy(() => {
        stopFresh()
    })

</script>

<div class="chat">
    <div class="metadata">
        <p>You are {$room.admin === $user ? 'owner' : 'member'} of this room</p>
        {#if $room.admin === $user}
            <button class="delete-button" on:click={deleteRoom}>Delete room</button>
        {/if}
    </div>
    <div class="feed">
        {#each messages as message}
            <div class="message">
                <p class="author">{message.sender}:</p>
                <div class="message-bubble">
                    <p class="message-text">{message.message}</p>
                </div>
            </div>
        {/each}
    </div>
    <div class="message-input">
        <input on:keydown={(e) => { if(e.keyCode === 13) sendMessage() }} class="input-box" placeholder="type message..." type="text" bind:value={newMessage} rows="3">
        <button on:click={sendMessage} disabled={newMessage.length === 0} class="send-button"><SendIcon /></button>
    </div>
</div>

<style>
    .chat {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 100%;
        position: relative;
    }

    .message-input {
        display: flex;
        gap: 2rem;
        padding: 2rem;
        border-top: 1px solid lightgray;
        width: 100%;
    }

    .input-box {
        resize: none;
        padding: 1rem;
        border: none;
        background-color: #EFEFEF;
        border-radius: .3rem;
        width: 100%;
    }

    .input-box:focus {
        outline: none;
    }

    .send-button {
        border: none;
        background-color: transparent;
        color: #3C85D8;
    }

    .send-button:disabled {
        color: lightgray;
    }

    .metadata {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .delete-button {
        border: none;
        background-color: #9c4242;
        color: white;
        border-radius: .3rem;
        height: 2.5rem;
        padding: 0 1rem;
    }

    .feed {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .message {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: flex-start;
    }

    .author {
        color: #333;
        font-weight: 700;
    }

    .message-bubble {
        color: #333;
        border-radius: 1rem;
        background-color: #EFEFEF;
        padding: 1rem;
    }

    .message-text {
        margin: 0;
    }
</style>