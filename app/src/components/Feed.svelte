<script>
    import SendIcon from '../assets/send.svelte'
    import { user } from '../stores/auth.js'
    import { getContext, onMount, onDestroy } from 'svelte'
    import { room } from '../stores/activeRoom.js'
    import AddBot from './AddBot.svelte'
    import UserList from './UserList.svelte'
    import Button from './Button.svelte'

    let messages = []
    let newMessage = ''
    let client = getContext('client')
    let stopFresh
    let feed

    const updateFeed = (res) => {
        if (res.body.messages) messages = res.body.messages
        let height = 20
        for (const message of feed.children) {
            height += message.clientHeight
            height += 20
        }
        setTimeout(() => feed.scrollTop = height, 50)
    }

    const getMessages = async () => {
        if ($room) {
            const res = await client.getMessages($room.id)
            updateFeed(res)
        }
    }

    const freshMessages = async () => {
        stopFresh = client.fresh.add(3000, () => client.getMessages($room.id), updateFeed)
    }

    const sendMessage = async () => {
        if (!newMessage) return
        const res = await client.postMessage($room.id, $user, newMessage)
        if (res.body.message) {
            newMessage = ''
        }
    }

    const deleteRoom = async () => {
        const res = await client.deleteRoom($room.id)
        if (res.body.message) $room = null
    }

    onMount(() => {
        getMessages()
        freshMessages()
    })

    const unsubRoom = room.subscribe((room) => {
        getMessages()
    })

    onDestroy(() => {
        stopFresh()
        unsubRoom()
    })
    
</script>

<div class="room">
    <div class="chat">
        <div class="feed" bind:this={feed}>
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
    <div class="metadata">
        {#if $room.admin === $user}
            <div class="admin-actions">
                <p>Admin actions:</p>
                <Button color="red" action={deleteRoom}>Delete room</Button>
            </div>
        {/if}
        <div>
            <p>Users in room:</p>
            <UserList />
        </div>
        <AddBot room={$room.name} />
    </div>
</div>

<style>
    .room {
        display: flex;
        width: 100%;
        height: 100%;
    }

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
        background-color: #F3F3F3;
        box-shadow: 0 0 1rem 0 lightgray;
        width: 35rem;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        overflow-y: scroll;
    }

    .metadata::-webkit-scrollbar {
        display: none;
    }

    .feed {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;
        scroll-behavior: smooth;
    }

    .feed::-webkit-scrollbar {
        display: none;
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

    .admin-actions {
        display: flex;
        flex-direction: column;
    }
</style>