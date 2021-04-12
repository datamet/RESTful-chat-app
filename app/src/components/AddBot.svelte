<script>
    import Button from './Button.svelte'
    import { getContext } from 'svelte';
    import createBot from '../../../client/bot/bot.js'
    import connection from '../../../client/client.js'

    export let room
    const host = getContext('host')
    const port = getContext('port')

    const addBot = () => {
        const botClient = connection({ host, port })
        const bot = createBot(botClient, { room })
        bot.start()
    }
</script>

<div>
    <div>
        <label for="room-name">Add bot:</label>
        <!-- <input type="text" id="room-name" bind:value={newBot}> -->
        <!-- <p class="error">{createRoomError}</p> -->
    </div>
    <Button action={addBot}>Create bot +</Button>
</div>
<style>

</style>