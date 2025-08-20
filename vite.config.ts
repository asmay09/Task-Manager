import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	ssr: {
		noExternal: ['bits-ui', 'lucide-svelte'] 
	},
	optimizeDeps: {
		include: ['bits-ui', 'lucide-svelte']
	}
});
