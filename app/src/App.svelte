<script>
	import { auth, user } from './stores/auth.js'
	import { onDestroy, onMount } from 'svelte'
	import { Router, Route, Link } from 'svelte-routing'
	import { setContext } from 'svelte'
	import connection from '../../client/client.js'

	import Header from './components/Header.svelte'
	import Sidepanel from './components/Sidepanel.svelte'

	export let host, port
	export let url = ""

	const client = connection()
	setContext('client', client)

	let unsubscribe
	if ($auth) client.state.update({ token: $auth })

	onMount(() => {
		unsubscribe = client.state.subscribe((state) => {
			if (state.token && typeof state.token === 'string') auth.set(state.token)
			else auth.set('')
			if (state.userID && typeof state.userID === 'string') user.set(state.userID)
			else user.set('')
		})
	})

	onDestroy(() => {
		unsubscribe()
	})

</script>

<Router {url}>		
	<Header />

	<div class="content">
		<Sidepanel />

		<main>
			
		</main>
	</div>
</Router>

<style>
	.content {
		display: flex;
		height: calc(100vh - 6rem);
	}
</style>