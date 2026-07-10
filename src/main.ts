import App from './App.svelte'
import {mount} from 'svelte'

const target = document.getElementById('app')
if (!target) {
	throw new Error('No #app element found')
}

mount(App, {target})
