import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	base: '',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@components': path.resolve(__dirname, './src/components'),
			'@router': path.resolve(__dirname, './src/router'),
			'@service': path.resolve(__dirname, './src/service'),
			'@stores': path.resolve(__dirname, './src/stores'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@views': path.resolve(__dirname, './src/views'),
			'@constants': path.resolve(__dirname, './src/constants'),
		},
	},
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
		watch: {
			ignored: ['**/src-tauri/**'],
		},
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		emptyOutDir: true,
		rollupOptions: {
			output: {
				manualChunks: undefined,
				assetFileNames: 'assets/[name]-[hash][extname]',
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
			},
		},
	},
})
