<script>
    import { room } from '../stores/activeRoom.js'
    import { onMount, getContext, onDestroy } from 'svelte'
    import PersonIcon from '../assets/person.svelte'
    import BotIcon from '../assets/bot.svelte'

    const client = getContext('client')
    let users = []
    let stopFetch

    const updateUsers = (res) => {
        if (res.body.users) users = res.body.users
    }

    const fetchUsers = async () => {
        const res = await client.getUsersInRoom($room.id)
        updateUsers(res)
        stopFetch = client.fresh.add(3000, () => client.getUsersInRoom($room.id), updateUsers)
    }

    onMount(() => {
        fetchUsers()
    })

    onDestroy(() => {
        stopFetch()
    })

</script>

<ul>
    {#each users as user (user.id)}
        <li>
            <div class="user-name">
                {#if user.bot}
                    <BotIcon />
                {:else}
                    <PersonIcon />
                {/if}
                <p>{user.username}</p>
            </div>
            {#if user.id === $room.admin && user.id === client.state.get().userID}
                <p class="admin">(admin/you)</p>
            {:else if user.id === $room.admin}
                <p class="admin">(admin)</p>
            {:else if user.id === client.state.get().userID}
                <p class="admin">(you)</p>
            {/if}
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    li {
        display: flex;
        border-radius: .3rem;
        padding: 1rem 2rem;
        justify-content: space-between;
        transition: all .2s linear;
    }

    li:hover {
        background-color: #DBDBDB;
    }

    .admin {
        font-weight: 700;
    }

    .user-name {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
</style>