<script>
	import { auth } from './stores/auth.js'
	import { onDestroy, onMount } from 'svelte'
	import { Router, Route, Link } from 'svelte-routing'
	import { setContext } from 'svelte'
	import connection from '../../client/client.js'

	import Header from './components/Header.svelte'
	import Login from './routes/Login.svelte'
	import Register from './routes/Register.svelte'
	import Profile from './routes/Profile.svelte'
	import Rooms from './routes/Rooms.svelte'
	import Room from './routes/Room.svelte'

	export let host, port
	export let url = ""

	const client = connection()
	setContext('client', client)

	let unsubscribe

	onMount(() => {
		unsubscribe = client.state.subscribe((state) => {
			if (state.token && typeof state.token === 'string') auth.set(state.token)
			else auth.set('')
		})
	})

	onDestroy(() => {
		unsubscribe()
	})

</script>

<Router {url}>		
	<Header />

	<main>
		<Route path="/login" component="{Login}" />
		<Route path="/register" component="{Register}" />
		<Route path="/profile" component="{Profile}" />
		<Route path="/rooms" component="{Rooms}" />
		<Route path="/room/:id" component="{Room}" />
	</main>
</Router>

<style>

</style>