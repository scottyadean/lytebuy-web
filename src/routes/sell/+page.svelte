<script lang="ts">
	import AppBadges from '$lib/components/AppBadges.svelte';
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import StatBlock from '$lib/components/StatBlock.svelte';
	import { appLinks, contact, site } from '$lib/config';

	const steps = [
		{
			step: '01',
			title: 'Get the app, or open it in a browser',
			body: 'Download it on your phone, or use the web app on whatever is behind the counter. Both do the same job.'
		},
		{
			step: '02',
			title: 'Create your account',
			body: 'Your business name, what you make or serve, where you are, and a few photos. Most people are done in under ten minutes.'
		},
		{
			step: '03',
			title: 'Post something and start selling',
			body: 'A deal, an event, a fresh batch, a service. It goes on the map and out to the people who follow you.'
		}
	];

	const payoutSteps = [
		{
			title: 'Connect your payout account',
			body: 'A one-time setup through Stripe, our payments provider. You enter your bank details with them directly. Lytebuy never sees or stores them.'
		},
		{
			title: 'Sales build your balance',
			body: 'Every completed sale is recorded to your own ledger. You can see exactly what you are owed, order by order, at any time.'
		},
		{
			title: 'Withdraw when you want it',
			body: 'Move your available balance to your connected account whenever you like, or set a schedule and let it run on its own.'
		},
		{
			title: 'It lands in your bank',
			body: 'Stripe pays out from your connected account to your bank on its normal schedule. Every transfer stays on your record.'
		}
	];
</script>

<Seo
	title="Start selling on Lytebuy"
	description="Listing on Lytebuy is free. You keep 100% of your online sale price, and taking a card in person costs just 1.2%. Here is how to sign up, how you get paid, and how tax works."
	schema={{
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'What does it cost to sell on Lytebuy?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Listing your business and posting promotions is free, with no monthly or setup fee. On an online sale a small platform fee is added to the buyer at checkout, so you keep 100% of your sale price. Taking a card in person with Tap to Pay costs 1.2% of the sale.'
				}
			},
			{
				'@type': 'Question',
				name: 'How do I get paid?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'You connect a payout account through Stripe. Sales build a balance on your own ledger, and you withdraw it to your bank whenever you like or on a schedule you set.'
				}
			},
			{
				'@type': 'Question',
				name: 'Does Lytebuy handle sales tax?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. As the marketplace, Lytebuy calculates, collects, and remits sales tax on your sales based on where the buyer is. It never comes out of your payout and you do not file sales-tax returns for your Lytebuy sales. Income tax on what you earn is still yours; we can provide a 1099 where one applies and a breakdown of your sales for your records.'
				}
			}
		]
	}}
/>

<Hero
	title="Start selling"
	accent="on lytebuy."
	lede="Free to list. Free to post. You keep 100% of your online sale price - and just 1.2% in person."
	poster="/img/come-in-were-awesome.jpg"
	posterAlt="A hanging shop sign reading Come in, we're awesome"
>
	{#snippet actions()}
		{#if appLinks.vendorSignup}
			<Button href={appLinks.vendorSignup} variant="onDark" size="lg">Create your account</Button>
		{:else}
			<Button href={appLinks.web} variant="onDark" size="lg">Open the app</Button>
		{/if}
		<Button
			href="#how-you-get-paid"
			size="lg"
			class="border border-white/40 text-white hover:bg-white/10"
		>
			How you get paid
		</Button>
	{/snippet}
</Hero>

<!-- Three steps -->
<Section tone="surface">
	<Reveal>
		<Eyebrow>Getting started</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Three steps, one afternoon.</h2>
	</Reveal>

	<!-- Reveal goes inside the <li>, not around it: an <ol> whose children are
	     <div>s is invalid markup, and assistive tech then stops announcing this
	     as a list of three steps - which is the point of the section. -->
	<ol class="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
		{#each steps as item, index (item.step)}
			<li class="border-t-2 border-thistle pt-5">
				<Reveal delay={index * 80}>
					<span class="font-display text-2xl text-thistle" aria-hidden="true">{item.step}</span>
					<h3 class="mt-2 text-lg">{item.title}</h3>
					<p class="mt-2 text-[0.9375rem] leading-relaxed">{item.body}</p>
				</Reveal>
			</li>
		{/each}
	</ol>

	<Reveal>
		<div class="mt-12 flex flex-col gap-6 border-t border-dust pt-10 md:flex-row md:items-center md:justify-between">
			<div>
				<h3 class="text-lg">Ready when you are</h3>
				<p class="mt-1.5 text-[0.9375rem] leading-relaxed">
					{#if appLinks.vendorSignup}
						Create your selling account, or get the app first.
					{:else}
						Get the app, or open the web app on any browser.
					{/if}
				</p>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				{#if appLinks.vendorSignup}
					<Button href={appLinks.vendorSignup} size="lg">Create your account</Button>
				{:else}
					<Button href={appLinks.web} size="lg">Open the web app</Button>
				{/if}
				<AppBadges />
			</div>
		</div>
	</Reveal>
</Section>

<!-- What it costs -->
<Section tone="accent">
	<Reveal>
		<Eyebrow>What it costs</Eyebrow>
		<h2 class="max-w-3xl text-display leading-[1.05]">
			Free to list. Nothing extra taken online, 1.2% in person.
		</h2>
		<div class="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed">
			<p>
				Listing your business is free. Posting promotions is free. There is no monthly fee and no
				setup fee.
			</p>
			<p>
				On an online sale, a small platform fee is added to the buyer at checkout. It funds the
				platform, and it means the price you set is the amount that reaches your balance.
			</p>
			<!-- POS is a genuinely different deal and the page used to claim 100%
			     unconditionally, which is not true in person: POS_COMMISSION_BPS is
			     120, i.e. 1.2% off the subtotal (services/orders.py:439). Saying it
			     plainly is both honest and a good number to be judged on. -->
			<p>
				Taking a card in person with Tap to Pay is <strong>1.2%</strong> of the sale, plus the
				card processing itself - there is no buyer-side fee in person, so this is what funds it.
				You are doing the work of serving someone at the counter, so we take less than we would
				online. No card reader to buy, no monthly fee, and your phone is the terminal.
			</p>
		</div>

		<div class="mt-14">
			<StatBlock
				stats={[
					{ value: '$0', label: 'To list your business and post promotions' },
					{ value: '100%', label: 'Of your sale price stays yours on an online sale' },
					{ value: '1.2%', label: 'Our cut on an in-person sale, plus card processing' }
				]}
			/>
		</div>
	</Reveal>
</Section>

<!-- Payouts -->
<Section id="how-you-get-paid" tone="surface">
	<Reveal>
		<Eyebrow>Getting paid</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">How the money reaches you.</h2>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			Lytebuy stays out of the flow of your funds. Payments run through Stripe, and your balance is
			yours to move whenever you want it.
		</p>
	</Reveal>

	<ol class="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-16">
		{#each payoutSteps as item, index (item.title)}
			<li>
				<Reveal delay={(index % 2) * 80} class="flex gap-5">
					<span class="font-display text-2xl text-thistle" aria-hidden="true">
						{String(index + 1).padStart(2, '0')}
					</span>
					<div>
						<h3 class="text-lg">{item.title}</h3>
						<p class="mt-1.5 text-[0.9375rem] leading-relaxed">{item.body}</p>
					</div>
				</Reveal>
			</li>
		{/each}
	</ol>
</Section>

<!-- Tax -->
<Section tone="canvas">
	<div class="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
		<Reveal>
			<Eyebrow>Tax</Eyebrow>
			<h2 class="text-display leading-[1.05]">Sales tax is handled. That's on us.</h2>
		</Reveal>

		<Reveal delay={100}>
			<div class="space-y-5 text-lg leading-relaxed">
				<p>
					<strong class="text-iron">Lytebuy collects and remits sales tax for you.</strong>
					As the marketplace, we calculate the right sales tax on each order based on where the
					buyer is, add it at checkout, and send it to the state. It never comes out of your
					payout, and you never file a sales-tax return for your Lytebuy sales.
				</p>
				<p>
					Your payout is your sale price minus bank transfer fees the sales tax is separate and handled
					by us. You can see the tax collected on your sales any time in your dashboard.
				</p>
				<p class="text-base text-charcoal">
					Income tax on your earnings is still yours, we can provide a
					<strong class="text-iron">1099</strong> where one applies and a yearly sales breakdown.
					We are not tax advisers; talk to yours.
				</p>
			</div>
		</Reveal>
	</div>
</Section>

<!-- Close -->
<Section tone="iron" space="md">
	<Reveal>
		<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
			<div>
				<h2 class="max-w-xl text-display leading-[1.05]">Put your shop on the map.</h2>
				<p class="mt-4 max-w-lg text-dust">
					{site.blurb}
				</p>
			</div>
			<div class="flex flex-wrap gap-3">
				{#if appLinks.vendorSignup}
					<Button href={appLinks.vendorSignup} variant="onDark" size="lg">
						Create your account
					</Button>
				{:else}
					<Button href={appLinks.web} variant="onDark" size="lg">Open the app</Button>
				{/if}
				<Button
					href="/get-involved"
					size="lg"
					class="border border-white/40 text-white hover:bg-white/10"
				>
					Talk to a human
				</Button>
			</div>
		</div>
		<p class="mt-8 text-sm text-granite">
			Questions before you start? <a
				href="mailto:{contact.email}"
				class="text-thistle underline underline-offset-4">{contact.email}</a
			>
		</p>
	</Reveal>
</Section>
