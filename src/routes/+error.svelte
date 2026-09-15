<script lang="ts">
	import { page } from '$app/state';

	import Button from '$lib/components/Button.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';

	// SvelteKit renders this for every error, not only 404s - a 500 here with
	// "I can't find that page" would be a lie, so the copy follows the status.
	const isMissing = $derived(page.status === 404);
	const heading = $derived(isMissing ? "You lost, dawg?" : 'Something went wrong.');
	const body = $derived(
		isMissing
			? "We can't find that page. It might have moved, or the link might have a typo in it."
			: (page.error?.message ?? 'Please try again in a moment.')
	);
</script>

<Seo title={isMissing ? 'Page not found' : 'Something went wrong'} noindex />

<Section tone="surface" space="lg">
	<div class="mx-auto flex max-w-3xl flex-col items-center text-center">
		<p class="text-sm font-semibold tracking-[0.18em] text-accent uppercase">
			{page.status}
		</p>

		<h1 class="mt-3 text-display leading-[1.05]">{heading}</h1>
		<p class="mt-4 max-w-xl text-lg leading-relaxed text-granite">{body}</p>

		<!-- Decorative: the heading already carries the message, so an alt
		     description would just be read out twice. -->
		<img
			src="/img/lost-dog.jpg"
			alt=""
			width="640"
			height="427"
			class="mt-10 w-full max-w-md rounded-[3px]"
		/>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
			<Button href="/" variant="primary" size="md">Back to the homepage</Button>
			<Button href="/get-involved" variant="secondary" size="md">Get in touch</Button>
		</div>
	</div>
</Section>
