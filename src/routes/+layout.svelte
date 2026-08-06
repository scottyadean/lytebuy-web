<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import '../app.css';

	let { children } = $props();

	// Photo-led pages run the nav over the hero; every other route gets solid
	// chrome from the first pixel so the logo never sits on white.
	const overlayRoutes = ['/', '/who-we-are', '/get-the-app', '/investors'];
	const overlay = $derived(overlayRoutes.includes(page.url.pathname));

	const gaId = env.PUBLIC_GA_ID;
</script>

<svelte:head>
	{#if gaId}
		<!-- Loaded async so measurement never blocks first paint. The inline
		     bootstrap is written via @html because Svelte would otherwise treat a
		     literal </script> in the markup as the end of this component. -->
		<script async src="https://www.googletagmanager.com/gtag/js?id={gaId}"></script>
		{@html `<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});
</${''}script>`}
	{/if}
</svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]
	       focus:bg-iron focus:px-4 focus:py-2 focus:text-white"
>
	Skip to content
</a>

<Nav {overlay} />

<!-- Overlay pages supply their own top spacing through the hero. -->
<main id="main" class={overlay ? '' : 'pt-16 md:pt-20'}>
	{@render children()}
</main>

<Footer />
