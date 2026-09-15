<script lang="ts">
	import AppBadges from '$lib/components/AppBadges.svelte';
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import FeeComparison from '$lib/components/FeeComparison.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Lantern from '$lib/components/Lantern.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import StatBlock from '$lib/components/StatBlock.svelte';
	import VendorCard from '$lib/components/VendorCard.svelte';
	import { appLinks, site } from '$lib/config';
	import { formatCount } from '$lib/format';
	import research from '../../../docs/reports/market-research.json';
	import type { Platform, Scenario } from '$lib/fees';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// LB-Web-8. Same build-time import of the LB-Web-5 research file as
	// /who-we-are - a static repo document, so nothing is fetched at runtime and
	// the two pages cannot drift apart.
	const lytebuy = research.lytebuy as unknown as Platform;
	const platforms = research.platforms as unknown as Platform[];
	const scenarios = research.comparison_scenarios as unknown as Scenario[];

	// The three evergreen "the return" stats, plus a live vendor count when the
	// backend is reachable. If the count is unavailable the block just shows the
	// three static stats (StatBlock lays out any length), so the page never shows
	// a wrong or zero figure.
	const returnStats = $derived([
		...(data.vendorCount != null
			? [{ value: formatCount(data.vendorCount), label: 'Local businesses on lytebuy' }]
			: []),
		{ value: 'Free', label: 'To list your business and post promotions' },
		{ value: '100%', label: 'Of your sale stays yours on a free listing' },
		{ value: 'It only takes minutes', label: 'From signing up to your first live promotion' }
	]);

	const sellSteps = [
		{
			step: '01',
			title: 'Claim your page',
			body: 'Name, photos, hours, the thing you are famous for. Minutes, not a project.'
		},
		{
			step: '02',
			title: 'Post what is good today',
			body: 'A deal, an event, a fresh batch. It lands with the people who follow you.'
		},
		{
			step: '03',
			title: 'Watch who walks in',
			body: 'Scan a code at the counter and see exactly which post brought them.'
		}
	];

	// Illustrative until the vendor directory is wired to the storefront API.
	const vendors = [
		{ name: 'Estrela Bakery', trade: 'Bread and pastry', town: 'Placerville, CA' },
		{ name: 'Hangtown Records', trade: 'Vinyl and repairs', town: 'Placerville, CA' },
		{ name: 'Cedar & Pine', trade: 'Handmade furniture', town: 'Camino, CA' },
		{ name: 'Apple Pantry Farm', trade: 'Orchard and cider', town: 'Apple Hill, CA' },
		{ name: 'Blue Plate Diner', trade: 'Breakfast all day', town: 'Placerville, CA' },
		{ name: 'Fair Trade Threads', trade: 'Vintage clothing', town: 'Coloma, CA' }
	];

	const products = [
		{ name: 'Sourdough, baked this morning', vendor: 'Estrela Bakery', price: '$7', deal: '30% off' },
		{ name: 'Walnut serving board', vendor: 'Cedar & Pine', price: '$48' },
		{ name: 'Guitar lessons, first hour', vendor: 'Hangtown Records', price: '$35', deal: 'New' },
		{ name: 'Cider flight for two', vendor: 'Apple Pantry Farm', price: '$18' }
	];
</script>

<Seo
	title="Main street in your pocket"
	description={site.description}
	schema={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: site.name,
		url: site.url,
		description: site.description,
		publisher: { '@type': 'Organization', name: site.name }
	}}
/>

<Hero
	size="full"
	title="Main street"
	accent="in your pocket."
	lede="Lytebuy puts the shops, makers and kitchens of your town on the map and hands the little guy the same reach the giants pay millions for."
	video="/video/placerville-hero.mp4"
	poster="/img/placerville-hero-poster.jpg"
>
	{#snippet actions()}
		<Button href={appLinks.web} variant="onDark" size="lg">Open on web</Button>
		<Button
			href="/sell"
			size="lg"
			class="border border-white/40 text-white hover:bg-white/10"
		>
			Start selling
		</Button>
		<!-- basis-full keeps the store badges on their own row: the actions
		     wrapper is a flex line, so without it they reflow up beside the
		     buttons at wider viewports. -->
		<AppBadges onDark class="basis-full" />
	{/snippet}
</Hero>

<!-- LB-Web-8: the fee comparison, above the mission. Same component and same
     data file as /who-we-are, so the two pages cannot show different numbers.
     Tone is canvas against the surface Mission band below it. -->
<Section id="what-it-costs" tone="canvas">
	<Reveal>
		<Eyebrow>Why Vendors Prefer Lytebuy</Eyebrow>
		<!-- The ticket wrote "It's a no brainer"; spelled out to match the rest of
		     the site, which writes contractions in full ("It is genuinely easy to
		     sell on lytebuy" further down this same page). -->
		<h2 class="max-w-2xl text-display leading-[1.05]">
			It is a no-brainer to sell on lytebuy.
		</h2>
		<!-- Deliberately not the same lede as /who-we-are: that page frames this as
		     evidence for a claim it just made, whereas here it is the pitch itself.
		     Identical copy on two pages reads as boilerplate and competes in search. -->
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			More of every sale stays with the person who made it. Pick an order size and see what the
			big marketplaces take out of the same sale, using each platform's own published fee
			schedule.
		</p>
	</Reveal>

	<Reveal delay={80}>
		<!-- LB-Web-9: the lamp post fills the empty right-hand column beside the
		     chart. The chart keeps its max-w-3xl measure (it was never meant to
		     stretch); the lamp takes the space that was blank. It only appears from
		     lg up - below that the chart uses the full width and there is no gap to
		     fill, so the illustration would just push the bars around. -->
		<div class="mt-12 grid items-end gap-10 lg:grid-cols-[minmax(0,48rem)_auto]">
			<div class="max-w-3xl">
				<FeeComparison
					{lytebuy}
					{platforms}
					{scenarios}
					ctaHref="/sell"
				/>
			</div>
			<!-- Decorative, so alt is empty: the chart beside it carries the meaning.
			     width/height are the file's own 76.2x254 units, kept so the browser
			     reserves the right aspect ratio and the row does not shift on load.

			     NOT loading="lazy": this sits inside a <Reveal>, which starts the
			     wrapper at opacity 0 and animates it in on scroll. A lazy image in a
			     transparent, off-screen wrapper never enters the loading viewport, so
			     it stayed permanently undecoded (naturalWidth 0) and the column
			     rendered blank. The file is only 31KB, so eager is the right call. -->
			<img
				src="/img/lamp-post.svg"
				alt=""
				width="76"
				height="254"
				decoding="async"
				class="hidden h-auto w-full max-w-[13rem] justify-self-center lg:block"
			/>
		</div>
	</Reveal>
</Section>

<!-- Mission -->
<Section id="mission" tone="surface">
	<div class="grid gap-14 lg:grid-cols-2 lg:gap-20">
		<Reveal>
			<Eyebrow>Our mission</Eyebrow>
			<!-- The full lantern sits beside the heading, sized to the heading so its
			     flicker animation carries the eye. It is the larger element now, so
			     the heading steps down from text-display to text-title. -->
			<div class="mt-4 flex items-center gap-6">
				<Lantern variant="full" class="h-40 w-auto shrink-0" />
				<h2 class="text-title leading-[1.05]">A small business network, not a marketplace giant.</h2>
			</div>
			<p class="mt-6 text-lg leading-relaxed">
				{site.blurb}
			</p>
			<p class="mt-5 leading-relaxed">
				Lytebuy exists to correct an imbalance. A woodworker, a baker or a record shop should be
				able to reach the people a few streets away without handing a fortune to an advertising
				machine. We keep the barrier low, the fees honest, and the money circulating where it was
				earned.
			</p>
			<div class="mt-8">
				<Button href="/who-we-are" variant="ghost">Read the whole story &rarr;</Button>
			</div>
		</Reveal>

		<Reveal delay={100}>
			<img
				src="/img/community-table.jpg"
				alt="A long communal table in a bakery, neighbours sharing coffee and bread"
				width="1600"
				height="2133"
				loading="lazy"
				decoding="async"
				class="h-full max-h-[34rem] w-full object-cover"
			/>
		</Reveal>
	</div>
</Section>

<!-- Featured vendor (LB-Web-3). Rendered only when the API returns one, so the
     page simply omits the section when no vendor is featured or the backend is
     unreachable - it never shows an empty shell. -->
{#if data.featuredVendor}
	<Section tone="accent">
		<Reveal>
			<Eyebrow>Featured vendor</Eyebrow>
			<div class="mt-4 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
				<div>
					<h2 class="text-title leading-[1.05]">{data.featuredVendor.name}</h2>
					{#if data.featuredVendor.blurb}
						<p class="mt-5 text-lg leading-relaxed">{data.featuredVendor.blurb}</p>
					{/if}
					<p class="mt-5 leading-relaxed">
						A different small business every time you visit - this is who is on lytebuy right
						now.
					</p>
					<div class="mt-8 flex flex-wrap items-center gap-4">
						<Button href={data.featuredVendor.storeUrl}>Visit the store &rarr;</Button>
						<Button href="/sell" variant="ghost">Sell on lytebuy</Button>
					</div>
				</div>

				{#if data.featuredVendor.bannerUrl}
					<img
						src={data.featuredVendor.bannerUrl}
						alt=""
						loading="lazy"
						decoding="async"
						class="h-full max-h-[24rem] w-full object-cover"
					/>
				{:else if data.featuredVendor.logoUrl}
					<!-- No banner: show the logo contained on a tint so it is not stretched. -->
					<div class="flex items-center justify-center bg-surface p-12">
						<img
							src={data.featuredVendor.logoUrl}
							alt=""
							loading="lazy"
							decoding="async"
							class="max-h-48 w-auto object-contain"
						/>
					</div>
				{/if}
			</div>
		</Reveal>
	</Section>
{/if}

<!-- What lytebuy does -->
<Section tone="canvas">
	<Reveal>
		<Eyebrow>What lytebuy does</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">
			Five tools, one purpose: get people through your door.
		</h2>
	</Reveal>

	<div class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
		<Reveal>
			<FeatureCard title="Map" icon="map">
				Find the best a town has to offer, quick and easy, on an interactive map.
			</FeatureCard>
		</Reveal>
		<Reveal delay={80}>
			<FeatureCard title="Notify" icon="bell">
				Follow the vendors you like and get their deals in your lytebuy inbox. No spam, ever.
			</FeatureCard>
		</Reveal>
		<Reveal delay={160}>
			<FeatureCard title="Page" icon="page">
				A free, customised page for your business that builds real search traffic.
			</FeatureCard>
		</Reveal>
		<Reveal>
			<FeatureCard title="Promotions" icon="tag">
				Create deals and events, cap them or leave them open, share them across the platform.
			</FeatureCard>
		</Reveal>
		<Reveal delay={80}>
			<FeatureCard title="Stats" icon="chart">
				See which promotion brought which customer, and plan the next one on evidence.
			</FeatureCard>
		</Reveal>
		<Reveal delay={160}>
			<div class="flex h-full flex-col justify-center border-l-2 border-thistle pl-6">
				<p class="font-display text-xl text-iron italic">
					“Give people a reason to take the main street detour.”
				</p>
			</div>
		</Reveal>
	</div>
</Section>

<!-- Get the app -->
<Section tone="iron">
	<div class="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
		<Reveal>
			<Eyebrow onDark>Get the app</Eyebrow>
			<h2 class="text-display leading-[1.05]">Your town, opened up.</h2>
			<p class="mt-6 text-lg leading-relaxed text-dust">
				Browse the map, follow the places you love, and get first word when something good comes out
				of the oven. Free, and it always will be for shoppers.
			</p>
			<AppBadges onDark class="mt-8" />
			<p class="mt-6 text-sm text-granite">
				Prefer a browser?
				<a href={appLinks.web} class="text-thistle underline underline-offset-4">
					Open the web app
				</a>.
			</p>
		</Reveal>

		<Reveal delay={100}>
			<img
				src="/img/local-cafe.jpg"
				alt="The interior of a small neighbourhood cafe with warm hanging lights"
				width="1600"
				height="1200"
				loading="lazy"
				decoding="async"
				class="w-full object-cover"
			/>
		</Reveal>
	</div>
</Section>

<!-- Selling is easy -->
<Section tone="surface">
	<div class="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
		<Reveal>
			<img
				src="/img/come-in-were-awesome.jpg"
				alt="A hanging shop sign reading Come in, we're awesome"
				width="1280"
				height="853"
				loading="lazy"
				decoding="async"
				class="w-full object-cover"
			/>
		</Reveal>

		<Reveal delay={100}>
			<Eyebrow>Sell with us</Eyebrow>
			<h2 class="text-display leading-[1.05]">It is genuinely easy to sell on lytebuy.</h2>
			<p class="mt-6 leading-relaxed">
				No agency, no ad budget, no six-week onboarding. You can be listed and posting before the
				lunch rush.
			</p>

			<ol class="mt-10 space-y-8">
				{#each sellSteps as item (item.step)}
					<li class="flex gap-5">
						<span class="font-display text-2xl text-thistle" aria-hidden="true">{item.step}</span>
						<div>
							<h3 class="text-lg">{item.title}</h3>
							<p class="mt-1.5 text-[0.9375rem] leading-relaxed">{item.body}</p>
						</div>
					</li>
				{/each}
			</ol>

			<div class="mt-10">
				<Button href="/sell" size="lg">Start selling</Button>
			</div>
		</Reveal>
	</div>
</Section>

<!-- ROI -->
<Section tone="accent" space="md">
	<Reveal>
		<Eyebrow>The return</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Reach without the advertising bill.</h2>
		<p class="mt-6 max-w-2xl leading-relaxed">
			Traditional local advertising asks for money up front and tells you almost nothing about what
			it bought. Lytebuy inverts that: listing is free, promotion is free, and every scan at your
			counter is attributed.
		</p>
		<div class="mt-12">
			<StatBlock stats={returnStats} />
		</div>
	</Reveal>
</Section>

<!-- Product feed -->
<Section tone="surface">
	<Reveal>
		<div class="flex flex-wrap items-end justify-between gap-6">
			<div>
				<Eyebrow>Fresh on lytebuy</Eyebrow>
				<h2 class="text-display leading-[1.05]">What is good today.</h2>
			</div>
			<Button href={appLinks.web} variant="secondary">See everything</Button>
		</div>
	</Reveal>

	<div class="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
		{#each products as product, index (product.name)}
			<Reveal delay={index * 70}>
				<ProductCard {...product} />
			</Reveal>
		{/each}
	</div>

	<p class="mt-8 text-sm text-granite">
		A sample of the feed. Live listings arrive with the product API.
	</p>
</Section>

<!-- Vendors -->
<Section id="vendors" tone="canvas">
	<Reveal>
		<Eyebrow>The neighbourhood</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">The people already on the map.</h2>
	</Reveal>

	<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each vendors as vendor, index (vendor.name)}
			<Reveal delay={index * 60}>
				<VendorCard {...vendor} />
			</Reveal>
		{/each}
	</div>

	<p class="mt-8 text-sm text-granite">
		An illustrative directory. Real vendor pages land with the storefront API.
	</p>
</Section>

<!-- Recent writing -->
{#if data.posts.length}
	<Section tone="surface">
		<Reveal>
			<div class="flex flex-wrap items-end justify-between gap-6">
				<div>
					<Eyebrow>From the blog</Eyebrow>
					<h2 class="text-display leading-[1.05]">Why any of this matters.</h2>
				</div>
				<Button href="/blog" variant="secondary">All posts</Button>
			</div>
		</Reveal>

		<div class="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
			{#each data.posts as post, index (post.id)}
				<Reveal delay={index * 80}>
					<PostCard {post} />
				</Reveal>
			{/each}
		</div>
	</Section>
{/if}

<!-- Closing call to action -->
<Section tone="iron" space="md">
	<Reveal>
		<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
			<div>
				<h2 class="max-w-xl text-display leading-[1.05]">Put your town back on the map.</h2>
				<p class="mt-4 max-w-lg text-dust">
					Free to list, free to post, and built by people who want your street to thrive.
				</p>
			</div>
			<div class="flex flex-wrap gap-3">
				<Button href="/sell" variant="onDark" size="lg">Start selling</Button>
				<Button
					href="/get-the-app"
					size="lg"
					class="border border-white/40 text-white hover:bg-white/10"
				>
					Get the app
				</Button>
			</div>
		</div>
	</Reveal>
</Section>
