<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import StatBlock from '$lib/components/StatBlock.svelte';
	import { contact } from '$lib/config';
	import FeeComparison from '$lib/components/FeeComparison.svelte';
	import research from '../../../../docs/reports/market-research.json';
	import type { Platform, Scenario } from '$lib/fees';

	// LB-Web-6. Build-time import of the LB-Web-5 research file - it is a static
	// document in the repo, not an API, so there is nothing to fetch at runtime.
	const lytebuy = research.lytebuy as unknown as Platform;
	const platforms = research.platforms as unknown as Platform[];
	const scenarios = research.comparison_scenarios as unknown as Scenario[];

	const values = [
		{
			title: 'Fair and honest, or not at all',
			body: 'We stay out of the flow of your funds, keep a per-vendor ledger, and never quietly change the terms. If we cannot do something honestly we would rather not ship it.'
		},
		{
			title: 'A low barrier for the little guy',
			body: 'Progressive onboarding means you can be selling before you have finished filling in forms. No agency retainer, no minimum spend, no gatekeeping.'
		},
		{
			title: 'Real people, really local',
			body: 'Artisan vetting and a reseller filter keep the platform full of people who actually make and serve things, not drop-shippers with a logo.'
		},
		{
			title: 'Built to outlast us',
			body: 'This is meant to be handed on, not flipped. That shapes every decision about what we build and who we take money from.'
		}
	];

	const steps = [
		{
			title: 'A vendor claims their page',
			body: 'Photos, hours, the thing they are known for. It becomes a real web page that search engines can find.'
		},
		{
			title: 'They post what is good today',
			body: 'A deal, a fresh batch, an event. Followers get it in their lytebuy inbox never an unsolicited push.'
		},
		{
			title: 'Neighbours find them on the map',
			body: 'Someone three streets away sees the offer, takes the detour, and spends their money locally.'
		},
		{
			title: 'The vendor sees what worked',
			body: 'A code scanned at the counter ties the visit back to the post, so the next campaign is planned on evidence.'
		}
	];
</script>

<Seo
	title="Who we are"
	description="Lytebuy exists to correct an imbalance of power between small local businesses and large corporations. Here is what we believe and how the platform works."
/>

<Hero
	title="We are on the side"
	accent="of the small shop."
	lede="A vendor platform that gives small business owners the reach of a national campaign at a price a corner bakery can afford."
	poster="/img/come-in-were-awesome.jpg"
	posterAlt="A hanging shop sign reading Come in, we're awesome"
/>

<!-- LB-Web-7: the fee comparison now opens the page. "Our vision", which used to
     sit above it, moved to its own footer-linked page at /our-vision. Tone is
     surface as the first band under the hero; the sections below alternate from
     there. -->
<Section tone="surface" id="what-it-costs">
	<Reveal>
		<Eyebrow>What it costs</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">
			Less of the sale, out of the same order.
		</h2>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			Every marketplace takes a cut. Here is what the big ones take out of one sale, next to
			ours - using each platform's own published fee schedule.
		</p>
	</Reveal>

	<Reveal delay={80}>
		<div class="mt-12 max-w-3xl">
			<FeeComparison {lytebuy} {platforms} {scenarios} />
		</div>
	</Reveal>
</Section>

<Section tone="canvas">
	<Reveal>
		<Eyebrow>What we believe</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Four things we will not trade away.</h2>
	</Reveal>

	<div class="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-16">
		{#each values as value, index (value.title)}
			<Reveal delay={(index % 2) * 80}>
				<h3 class="text-title">{value.title}</h3>
				<p class="mt-3 leading-relaxed">{value.body}</p>
			</Reveal>
		{/each}
	</div>
</Section>

<Section id="how-it-works" tone="surface">
	<Reveal>
		<Eyebrow>How it works</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">From a shop door to a sale.</h2>
	</Reveal>

	<ol class="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
		{#each steps as step, index (step.title)}
			<Reveal delay={index * 70}>
				<li class="border-t-2 border-thistle pt-5">
					<span class="font-display text-sm text-accent">Step {index + 1}</span>
					<h3 class="mt-2 text-lg">{step.title}</h3>
					<p class="mt-2 text-[0.9375rem] leading-relaxed">{step.body}</p>
				</li>
			</Reveal>
		{/each}
	</ol>
</Section>

<Section tone="iron" space="md">
	<Reveal>
		<Eyebrow onDark>Where we are</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Starting where we live.</h2>
		<p class="mt-6 max-w-2xl leading-relaxed text-dust">
			We are building in {contact.town}, in the open, with the businesses on our own main street.
			Growth comes town by town, not by carpet-bombing a market.
		</p>
		<div class="mt-12">
			<StatBlock
				onDark
				stats={[
					{ value: 'Free', label: 'For every vendor listing and promotion' },
					{ value: 'Local', label: 'Vetted makers and services, not resellers' },
					{ value: 'Open', label: 'We publish what we are building and why' }
				]}
			/>
		</div>
	</Reveal>
</Section>

<Section tone="surface" space="md">
	<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
		<div>
			<h2 class="max-w-xl text-title">Want to be part of it?</h2>
			<p class="mt-3 max-w-lg leading-relaxed">
				Whether you are selling, investing, or just curious, we would like to hear from you.
			</p>
		</div>
		<div class="flex flex-wrap gap-3">
			<Button href="/get-involved" size="lg">Get involved</Button>
			<Button href="/get-the-app" variant="secondary" size="lg">Get the app</Button>
		</div>
	</div>
</Section>
