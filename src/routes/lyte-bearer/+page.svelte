<script lang="ts">
	// LB-WEB-10. The public pitch for becoming a lyte bearer (what the code and
	// API call an "affiliate" - the brand term is user-facing only).
	//
	// Scott: "I really want to keep the messaging clear... the main point of the
	// page is how to become an affiliate." So the four steps are the spine of the
	// page and everything else is kept short enough not to bury them.
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import StatBlock from '$lib/components/StatBlock.svelte';
	import { appLinks } from '$lib/config';

	const steps = [
		{
			step: '01',
			title: 'Join the program',
			body: 'One tap in the app gives you a referral code that is yours alone. No application, no waiting to be approved.'
		},
		{
			step: '02',
			title: 'Pick the shops you love',
			body: 'Open a local store you already rate and ask to promote them. They agree a rate with you - it is a conversation, not a form.'
		},
		{
			step: '03',
			title: 'Share what is good',
			body: 'Post the shop, the deal, the fresh batch. Your links work anywhere - a text, a story, a community group.'
		},
		{
			step: '04',
			title: 'Get paid',
			body: 'When someone buys through your link, your commission lands on your own ledger. Withdraw it to your bank whenever you like.'
		}
	];

	const why = [
		{
			icon: 'map' as const,
			title: 'You already know the good ones',
			body: 'The baker who gets in at four. The shop that fixes things nobody else will. You have been telling people for years - this pays you for it.'
		},
		{
			icon: 'tag' as const,
			title: 'You agree the rate',
			body: 'Every deal is negotiated between you and the shop. Neither side can set it alone, so nobody gets surprised.'
		},
		{
			icon: 'chart' as const,
			title: 'You see what worked',
			body: 'Orders, commission earned, and which shops are performing - all on your own dashboard, updated as sales land.'
		}
	];
</script>

<Seo
	title="Become a lyte bearer"
	description="Promote the shops and makers on your own main street, and get paid when people buy. Here is how to become a lyte bearer on Lytebuy."
	schema={{
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'What is a lyte bearer?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'A lyte bearer promotes the local shops, makers and kitchens they already love, and earns a commission when someone buys through their link. It is Lytebuy’s affiliate program, built around your own town rather than anonymous online traffic.'
				}
			},
			{
				'@type': 'Question',
				name: 'How do I become a lyte bearer?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Open the Lytebuy app, join the program in one tap, and you get your own referral code. There is no application and no approval queue. You then ask the shops you want to promote to agree a commission rate with you.'
				}
			},
			{
				'@type': 'Question',
				name: 'How much does a lyte bearer earn?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'The rate is agreed between you and each shop, so it varies. You set the rate you usually ask for, the shop accepts it or counters, and the agreed rate applies to sales you refer. Commission is paid out to your bank through Stripe.'
				}
			}
		]
	}}
/>

<Hero
	title="Become a"
	accent="lyte bearer."
	lede="Affiliates: Promote foot traffic to your town and get paid."
	poster="/img/lyte-bearer-hero.jpg"
	posterAlt="A small-town main street at dusk, shopfronts lit along both sides"
>
	{#snippet actions()}
		<Button href={appLinks.web} variant="onDark" size="lg">Open the app</Button>
		<Button
			href="#how-to-start"
			size="lg"
			class="border border-white/40 text-white hover:bg-white/10"
		>
			How it works
		</Button>
	{/snippet}
</Hero>

<!-- What it is, in as few words as possible. The ticket asks for clear
     messaging, so this stays to two short paragraphs before the steps. -->
<Section tone="surface">
	<div class="mx-auto max-w-3xl">
		<Reveal>
			<Eyebrow>What it is</Eyebrow>
			<h2 class="text-display leading-[1.05]">You know your town. Get paid for it.</h2>
			<div class="mt-8 space-y-5 text-lg leading-relaxed">
				<p>
					A lyte bearer promotes the shops, makers and kitchens on their own main street. When
					someone buys through your link, you earn a share of the sale - agreed with the shop,
					up front.
				</p>
				<p>
					It is not anonymous internet traffic. It is the cafe you take people to, the maker you
					keep recommending, and the street you would like to see busy on a Tuesday.
				</p>
			</div>
		</Reveal>
	</div>
</Section>

<!-- The point of the page. -->
<Section id="how-to-start" tone="canvas">
	<Reveal>
		<Eyebrow>How to become one</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Four steps, one afternoon.</h2>
	</Reveal>

	<!-- Reveal goes inside the <li>, not around it: an <ol> whose children are
	     <div>s is invalid markup, and assistive tech then stops announcing this
	     as a list of four steps - which is the point of the section. -->
	<ol class="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
		{#each steps as item, index (item.step)}
			<li class="border-t-2 border-thistle pt-5">
				<Reveal delay={index * 70}>
					<span class="font-display text-2xl text-thistle" aria-hidden="true">{item.step}</span>
					<h3 class="mt-2 text-lg">{item.title}</h3>
					<p class="mt-2 text-[0.9375rem] leading-relaxed">{item.body}</p>
				</Reveal>
			</li>
		{/each}
	</ol>

	<Reveal>
		<div class="mt-12 border-t border-dust pt-10">
			<Button href={appLinks.web} size="lg">Open the app and join</Button>
		</div>
	</Reveal>
</Section>

<!-- A photograph between the two text-heavy bands, so the page has some air. -->
<Section tone="surface" space="md" bleed>
	<Reveal>
		<img
			src="/img/main-street-day.jpg"
			alt="Shopfronts and hanging flower baskets along a small-town main street"
			width="1600"
			height="1068"
			loading="lazy"
			decoding="async"
			class="h-[42svh] w-full object-cover"
		/>
	</Reveal>
</Section>

<Section tone="surface">
	<Reveal>
		<Eyebrow>Why people do it</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">The reasons that actually come up.</h2>
	</Reveal>

	<div class="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
		{#each why as item, index (item.title)}
			<Reveal delay={index * 80}>
				<FeatureCard title={item.title} icon={item.icon}>
					{item.body}
				</FeatureCard>
			</Reveal>
		{/each}
	</div>

	<Reveal>
		<div class="mt-14">
			<StatBlock
				stats={[
					{ value: '$0', label: 'To join. No application and no approval queue' },
					{ value: 'You agree', label: 'The rate, with each shop, before anything is earned' },
					{ value: 'Your bank', label: 'Commission is paid out through Stripe' }
				]}
			/>
		</div>
	</Reveal>
</Section>

<Section tone="iron" space="md">
	<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
		<div>
			<h2 class="max-w-xl text-display leading-[1.05]">Ready to carry the lyte?</h2>
			<p class="mt-4 max-w-lg leading-relaxed text-dust">
				Join in the app, pick your first shop, and start telling people what is good.
			</p>
		</div>
		<div class="flex flex-wrap gap-3">
			<Button href={appLinks.web} variant="onDark" size="lg">Open the app</Button>
			<Button
				href="/sell"
				size="lg"
				class="border border-white/40 text-white hover:bg-white/10"
			>
				I run a shop
			</Button>
		</div>
	</div>
</Section>
