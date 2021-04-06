import { writable } from 'svelte/store'

function createAuth() {
    const token = localStorage.getItem('auth') ? localStorage.getItem('auth') : ''
	const { subscribe, set, update } = writable(token);

	return {
		subscribe,
		set: (value) => {
            set(value)
            localStorage.setItem('auth', value)
        }
	};
}

export const auth = createAuth();

function createUser() {
    const token = localStorage.getItem('user') ? localStorage.getItem('user') : ''
	const { subscribe, set, update } = writable(token);

	return {
		subscribe,
		set: (value) => {
            set(value)
            localStorage.setItem('user', value)
        }
	};
}

export const user = createUser();