<script>
    import { user } from '../stores/auth.js'
    import { getContext } from 'svelte'

    const client = getContext('client')
    let username = ''

    const getUser = async () => {
        const res = await client.getUser($user)
        if (res.body.user) username = res.body.user.username
    }

    getUser()
</script>

<p>You are logged in as {username}</p>

<style>
    p {
        margin: 0;
        padding: 0;
    }
</style>