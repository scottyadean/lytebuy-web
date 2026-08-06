<script lang="ts">
	import AppBadges from '$lib/components/AppBadges.svelte';
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { appLinks } from '$lib/config';
</script>

<Seo
	title="Get the app"
	description="Browse the map, follow your favourite local vendors, and get their deals in your lytebuy inbox. Free on iOS, Android and the web."
	schema={{
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Lytebuy',
		applicationCategory: 'ShoppingApplication',
		operatingSystem: 'iOS, Android, Web',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
	}}
/>

<Hero
	title="Your town,"
	accent="in your pocket."
	lede="The map, the makers, and first word when something good comes out of the oven."
	poster="/img/local-cafe.jpg"
	posterAlt="The interior of a small neighbourhood cafe"
>
	{#snippet actions()}
		<Button href={appLinks.web} variant="onDark" size="lg">Open the web app</Button>
	{/snippet}
</Hero>

<Section tone="surface">
	<div class="grid gap-14 lg:grid-cols-2 lg:gap-20">
		<Reveal>
			<Eyebrow>Download</Eyebrow>
			<h2 class="text-display leading-[1.05]">Free, and free of nonsense.</h2>
			<p class="mt-6 text-lg leading-relaxed">
				No subscription, no fee to browse, and no notifications you did not ask for. You choose the
				vendors you hear from, and you can unsubscribe from any of them at any time.
			</p>
			<AppBadges class="mt-8" />
			<p class="mt-6 text-sm text-granite">
				The mobile apps are in build. In the meantime the
				<a href={appLinks.web} class="text-accent underline underline-offset-4">web app</a>
				does everything the phone app will.
			</p>
		</Reveal>

		<Reveal delay={100}>
			<div class="grid gap-10 sm:grid-cols-2">
				<FeatureCard title="Map" icon="map">
					See what is worth a detour, wherever you happen to be standing.
				</FeatureCard>
				<FeatureCard title="Notify" icon="bell">
					Follow a bakery, hear about the morning batch. Never any spam.
				</FeatureCard>
				<FeatureCard title="Promotions" icon="tag">
					Claim a deal on your phone and redeem it at the counter with a scan.
				</FeatureCard>
				<FeatureCard title="Inbox" icon="page">
					Everything from the places you follow, in one quiet place.
				</FeatureCard>
			</div>
		</Reveal>
	</div>
</Section>

<Section tone="iron" space="md">
	<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
		<div>
			<h2 class="max-w-xl text-display leading-[1.05]">Run a shop instead?</h2>
			<p class="mt-4 max-w-lg text-dust">
				Listing is free, and you can post your first promotion in minutes.
			</p>
		</div>
		<Button href="/sell" variant="onDark" size="lg">Start selling</Button>
	</div>
</Section>
