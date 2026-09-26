import {svelte} from '@sveltejs/vite-plugin-svelte'
import {defineConfig} from 'vite'

export default defineConfig(({mode}) => ({
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
	// NOTE: inlineDynamicImports stays true (Tauri asset-protocol single-file
	// requirement). @mediapipe/tasks-genai is dynamically imported at runtime
	// so it is NOT bundled into the main chunk — no manualChunks needed.
	esbuild: {
		drop: mode === 'production' ? (['console', 'debugger'] as const) : [],
	},
	build: {
		target: 'es2022',
		minify: 'esbuild',
		sourcemap: false,
		assetsInlineLimit: 4096,
		cssMinify: true,
		chunkSizeWarningLimit: 2000,
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
}))
