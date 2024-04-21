import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@assets': path.resolve(__dirname, './src/assets'),
			'@components': path.resolve(__dirname, './src/components'),
			'@router': path.resolve(__dirname, './src/router'),
			'@service': path.resolve(__dirname, './src/service'),
			'@stores': path.resolve(__dirname, './src/stores'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@views': path.resolve(__dirname, './src/views'),
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
})
