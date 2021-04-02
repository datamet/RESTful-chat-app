<script>
	import { Router, Route, Link } from 'svelte-routing'
	import { setContext } from 'svelte'
	import connection from '../../client/client.js'

	import Login from './routes/Login.svelte'
	import Register from './routes/Register.svelte'
	import Profile from './routes/Profile.svelte'
	import Rooms from './routes/Rooms.svelte'
	import Room from './routes/Room.svelte'

	export let host, port;
	export let url = ""

	const client = connection()
	setContext('client', client)
</script>

<Router {url}>		
	<header>
		<ul>
			<li><Link to="/">Home</Link></li>
			<li><Link to="/rooms">Rooms</Link></li>
			<li><Link to="/login">Login</Link></li>
			<li><Link to="/register">Register</Link></li>
			<li><Link to="/profile">Profile</Link></li>
		</ul>
	</header>

	<main>
		<Route path="/login" component="{Login}" />
		<Route path="/register" component="{Register}" />
		<Route path="/profile" component="{Profile}" />
		<Route path="/rooms" component="{Rooms}" />
		<Route path="/room/:id" component="{Room}" />
	</main>
</Router>

<style>
	ul {
		padding: 0;
		margin: 0;
		display: flex;
		gap: 2rem;
	}
</style>