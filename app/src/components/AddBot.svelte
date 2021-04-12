<script>
    import Button from './Button.svelte'
    import { getContext } from 'svelte';
    import createBot from '../../../client/bot/bot.js'
    import connection from '../../../client/client.js'
    import { room as activeRoom } from '../stores/activeRoom.js'

    export let room
    const host = getContext('host')
    const port = getContext('port')
    const client = getContext('client')
    let name = ''
    let createBotError = ''

    const addBot = async () => {
        const res = await client.getUsers()
        if (res.body.users) {
            if (!name || name.length < 3) {
                createBotError = "Name must be 3 characters or longer"
                return
            }
            for (const user of res.body.users) {
                if (user.username === name) {
                    createBotError = "A bot or user with that name allready exists"
                    return
                }
            }
        }
        const botClient = connection({ host, port })
        const bot = createBot(botClient, { room, name })
        bot.start()

        createBotError = ''
        name = ''
    }
</script>

<div class="add-bot">
    <div>
        <label for="room-name">New bot name:</label>
        <input type="text" id="room-name" bind:value={name}>
        <p class="error">{createBotError}</p>
    </div>
    <Button action={addBot}>Add {name ? name : 'bot'} to {$activeRoom.name} +</Button>
</div>
<style>
    .add-bot {
        display: flex;
        flex-direction: column;
    }

    .error {
        color: #a35353;
    }
</style>