import nodeAdapter from '@sveltejs/adapter-node';
import amplifyAdapter from 'amplify-adapter';

// SSR is required, not optional: 9 server routes, two real form actions
// (get-involved, suggest-a-shop) and blog/press pages that fetch from the blog
// service SERVER-SIDE, where the API key lives. Static export would break all of
// that or leak the key to the browser.
//
// Two adapters because they emit different shapes and only one works per target:
//   amplify-adapter -> .amplify-hosting/ with a deploy-manifest.json  (Amplify)
//   adapter-node    -> build/index.js, a standalone Node server        (local, docker)
//
// The first Amplify build compiled fine and then failed to DEPLOY, because
// adapter-node's output is not a layout Amplify understands. adapter-auto does
// not solve this - it only knows Cloudflare, Netlify, Node and Vercel, with no
// Amplify support at all.
//
// AWS_APP_ID is set by the Amplify build container and by nothing else, which is
// what makes this switch reliable rather than a guess.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAmplifyBuild = Boolean((globalThis as any).process?.env?.AWS_APP_ID);
const adapter = isAmplifyBuild ? amplifyAdapter : nodeAdapter;
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-AUTO, not adapter-node.
			//
			// SSR is required, not optional: 9 server routes, two real form actions
			// (get-involved, suggest-a-shop) and blog/press pages that fetch from the
			// blog service server-side, where the API key lives. adapter-static would
			// break all of that.
			//
			// But adapter-node emits build/index.js - a standalone Node server -
			// which Amplify Hosting cannot deploy. It expects .amplify-hosting/ with
			// a deploy-manifest.json. That mismatch is why the Amplify build failed
			// AFTER compiling successfully: nothing was wrong with the code, the
			// output was just the wrong shape.
			//
			// adapter-auto detects the platform and emits what it wants: the Amplify
			// layout on Amplify, and adapter-node locally, so `npm run preview` and
			// the Dockerfile keep working.
			adapter: adapter()
		})
	]
});
