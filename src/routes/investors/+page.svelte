<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact } from '$lib/config';

	const thesis = [
		{
			title: 'The spend is already local',
			body: 'Small and independent businesses take a large share of consumer spending, but almost none of the digital tooling is built for them. The demand does not need creating, only connecting.'
		},
		{
			title: 'Advertising prices them out',
			body: 'A national platform charges a corner bakery the same attention rates as a chain. Free listing plus attributed promotion is a structurally cheaper way to reach the same street.'
		},
		{
			title: 'Density compounds',
			body: 'Every vendor brings their own customers, and every customer discovers neighbouring vendors. Town by town, the map gets more useful to everybody already on it.'
		},
		{
			title: 'Revenue without gouging',
			body: 'Optional paid placement, subscriptions and transaction fees on assisted sales never a toll on a vendor simply existing on the platform.'
		}
	];
</script>

<Seo
	title="Investors"
	description="Why Lytebuy exists, how the model works, and how to reach us if you invest in local commerce."
/>

<Hero
	title="A different bet"
	accent="on local commerce."
	lede="Handing leverage back to the people who make things with their hands, and building a business that can outlast us."
	poster="/img/community-table.jpg"
	posterAlt="A long communal table in a bakery"
/>

<Section tone="surface">
	<div class="mx-auto max-w-3xl">
		<Reveal>
			<Eyebrow>The short version</Eyebrow>
			<h2 class="text-display leading-[1.05]">What we are building, and why now.</h2>
			<div class="mt-8 space-y-5 text-lg leading-relaxed">
				<p>
					Lytebuy is a marketplace and promotion platform for small, local, mostly artisan
					businesses. Vendors list for free, publish promotions to people who chose to follow them,
					and get real attribution for what those promotions produced.
				</p>
				<p>
					Most software built for this segment either extracts heavily or was designed for national
					brands and handed down. We are building for the corner shop first, and we are doing it
					in a town where we can walk into every business on the list, then on to the next.  
				</p>

				<p>
					One main street at a time accross the entire United States. 
				</p>
			</div>
		</Reveal>
	</div>
</Section>

<Section tone="canvas">
	<Reveal>
		<Eyebrow>The thesis</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Four reasons this works.</h2>
	</Reveal>

	<div class="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-16">
		{#each thesis as item, index (item.title)}
			<Reveal delay={(index % 2) * 80}>
				<h3 class="text-title">{item.title}</h3>
				<p class="mt-3 leading-relaxed">{item.body}</p>
			</Reveal>
		{/each}
	</div>
</Section>

<Section tone="iron" space="md">
	<Reveal>
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-display leading-[1.05]">Let us talk properly.</h2>
			<p class="mt-6 leading-relaxed text-dust">
				We are happy to walk through the product, the roadmap and the numbers. Detailed materials
				are shared on request rather than published here.
			</p>
			<div class="mt-9 flex flex-wrap justify-center gap-3">
				<Button href="/get-involved" variant="onDark" size="lg">Request the deck</Button>
				<Button
					href="mailto:{contact.email}"
					size="lg"
					class="border border-white/40 text-white hover:bg-white/10"
				>
					{contact.email}
				</Button>
			</div>
		</div>
	</Reveal>
</Section>
