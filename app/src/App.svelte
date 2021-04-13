<script>
	import { auth, user } from './stores/auth.js'
	import { room } from './stores/activeRoom.js'
	import { onDestroy, onMount } from 'svelte'
	import { setContext } from 'svelte'
	import connection from '../../client/client.js'

	import Header from './components/Header.svelte'
	import Sidepanel from './components/Sidepanel.svelte'
	import Chat from './components/Chat.svelte'

	let host = window.location.hostname
	let port = window.location.port

	const client = connection({ host, port })
	setContext('client', client)
	setContext('host', host)
	setContext('port', port)

	let unsubscribe
	if ($auth) client.state.update({ token: $auth })
	if ($user) client.state.update({ userID: $user })

	onMount(() => {
		unsubscribe = client.state.subscribe((state) => {
			if (state.token && typeof state.token === 'string') auth.set(state.token)
			else {
				auth.set('')
				room.set(null)
			}
			if (state.userID && typeof state.userID === 'string') user.set(state.userID)
			else user.set('')
		})
	})

	onDestroy(() => {
		unsubscribe()
	})

</script>

<Header />
<div class="content">
	<Sidepanel />
	<main>
		<Chat />
	</main>
</div>

<style>
	.content {
		display: flex;
		height: calc(100vh - 6rem);
		width: 100%;
		justify-items: stretch;
	}

	main {
		height: 100%;
		width: 100%
	}
</style>