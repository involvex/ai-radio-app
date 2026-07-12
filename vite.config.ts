import {svelte} from '@sveltejs/vite-plugin-svelte'
import {defineConfig} from 'vite'

export default defineConfig({
	plugins: [svelte()],
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
		host: '0.0.0.0',
		watch: {
			ignored: ['**/src-tauri/**'],
		},
	},
	build: {
		target: 'esnext',
		minify: 'esbuild',
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
	resolve: {
		conditions: ['browser', 'import'],
		mainFields: ['module', 'jsnext:main', 'jsnext'],
	},
})
