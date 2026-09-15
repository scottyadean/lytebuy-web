<style>
	.stree-lamp{
		background: url("/img/lantern-post.jpg") -10px -50px no-repeat; 
		background-size: 350px auto;
	}
</style>
<script lang="ts">
	// LB-WEB-11. "Promote your town" - the fork in the road.
	//
	// There are two ways to drive foot traffic to your own main street, and until
	// now a visitor had to already know which one they were: /sell and
	// /lyte-bearer both exist but nothing tells you which is yours. Scott: "This
	// should almost be like a step by step of how to do this so it is very clear
	// what path to take."
	//
	// So the page answers ONE question first - do you sell things, or do you know
	// people who do? - and only then shows the numbered steps for each path. Both
	// columns run side by side rather than stacked, so the choice is visible in a
	// single glance rather than requiring a scroll to discover the second option.
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const paths = [
		{
			id: 'vendor',
			kicker: 'You have something to sell',
			title: 'As a vendor',
			blurb:
				'You make, bake, grow, fix or serve something. Put it on the map so the people a few streets away can find it.',
			steps: [
				'Get the app, or open it in any browser.',
				'Create your account - business name, what you do, where you are, a few photos.',
				'Post what is good today: a deal, an event, a fresh batch.',
				'Connect your payout account, and sales land in your bank.'
			],
			cta: { href: '/sell', label: 'Start selling' },
			foot: 'Free to list. Nothing extra taken online, 1.2% in person.'
		},
		{
			id: 'lyte-bearer',
			kicker: 'You know the good ones',
			title: 'As a lyte bearer',
			blurb:
				'You do not need a shop of your own. Promote the places you already tell people about, and earn a share when someone buys.',
			steps: [
				'Get the app and join the program in one tap.',
				'Pick the shops you love and agree a rate with them.',
				'Share what is good - your links work anywhere.',
				'Commission lands on your ledger, and you withdraw it.'
			],
			cta: { href: '/lyte-bearer', label: 'Become a lyte bearer' },
			foot: 'Free to join. No application and no approval queue.'
		}
	];
</script>

<Seo
	title="Promote your town"
	description="Two ways to drive foot traffic to your own main street: sell what you make, or promote the shops you already love. Here is the step-by-step for each."
	schema={{
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'How can I help my town on Lytebuy?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Two ways. If you sell something - food, craft, a service - list it as a vendor so neighbours can find you. If you do not sell anything but know the good local shops, become a lyte bearer: promote them and earn a share of what you refer.'
				}
			},
			{
				'@type': 'Question',
				name: 'Which one should I pick?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'If you have something of your own to sell, start as a vendor. If you want to promote other people’s shops, start as a lyte bearer. You can do both with the same account.'
				}
			}
		]
	}}
/>

<Hero
	title="Promote"
	accent="your town."
	lede="Two ways to drive foot traffic to your own main street. Pick the one that sounds like you."
	poster="/img/main-street-day.jpg"
	posterAlt="Shopfronts and hanging flower baskets along a small-town main street"
>
	{#snippet actions()}
		<Button href="#pick-your-path" variant="onDark" size="lg">Show me how</Button>
	{/snippet}
</Hero>

<!-- The fork. Both paths side by side from md up so the choice is one glance. -->
<Section id="pick-your-path" tone="surface">
	<Reveal>
		<Eyebrow>Pick your path</Eyebrow>
		
		<div class=" grid gap-5 md:grid-cols-2 md:gap-40">
		<div class="mt-1">
		<h2 class="max-w-2xl text-display leading-[1.05]">Do you sell things, or know people who do?</h2>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			That is the only question. Either way you are doing the same job - getting people through a
			local door instead of onto a warehouse website.
		</p>
		</div>

		<div>
			<div class="stree-lamp h-70 shadow-lg overflow-hidden rounded-lg w-80" title="Lyte the way" >
			</div>
		</div>

		</div>
	</Reveal>

	<div class="mt-14 grid gap-12 md:grid-cols-2 md:gap-10">
		{#each paths as path, index (path.id)}
			<Reveal delay={index * 90}>
				<!-- h-full + flex so both columns end level, whatever the copy length,
				     and the two CTAs line up rather than staggering. -->
				<div class="flex h-full flex-col border-t-2 border-thistle pt-6">
					<span class="font-display text-sm text-accent">{path.kicker}</span>
					<h3 class="mt-1 text-title leading-[1.1]">{path.title}</h3>
					<p class="mt-3 leading-relaxed">{path.blurb}</p>

					<ol class="mt-6 space-y-4">
						{#each path.steps as step, i (step)}
							<li class="flex gap-4">
								<span
									class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
									       bg-accent-soft font-display text-sm text-accent"
									aria-hidden="true"
								>
									{i + 1}
								</span>
								<span class="text-[0.9375rem] leading-relaxed">{step}</span>
							</li>
						{/each}
					</ol>

					<!-- mt-auto pins the CTA to the bottom of the taller column. -->
					<div class="mt-auto pt-8">
						<Button href={path.cta.href} size="lg">{path.cta.label}</Button>
						<p class="mt-3 text-sm text-charcoal">{path.foot}</p>
					</div>
				</div>
			</Reveal>
		{/each}
	</div>
</Section>

<Section tone="canvas" space="md">
	<div class="mx-auto max-w-3xl text-center">
		<Reveal>
			<h2 class="text-title leading-[1.1]">Not sure? You can do both.</h2>
			<p class="mt-4 leading-relaxed">
				The same account can sell your own things and promote someone else's. Plenty of people
				start on one side and add the other later.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-3">
				<Button href="/sell" size="lg">Start selling</Button>
				<Button href="/lyte-bearer" variant="secondary" size="lg">Become a lyte bearer</Button>
			</div>
		</Reveal>
	</div>
</Section>

<!-- The third path, and the lightest one. Both options above ask for an ongoing
     commitment; plenty of people want neither but can still name the shop that
     should be here. Asking for that is a lead we would otherwise never get. -->
<Section tone="iron" space="md">
	<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
		<div>
			<Eyebrow onDark>Neither of those?</Eyebrow>
			<h2 class="max-w-xl text-title leading-[1.1]">Just tell us who we are missing.</h2>
			<p class="mt-4 max-w-lg leading-relaxed text-dust">
				The baker who never posts online, the mechanic everyone recommends. Give us a name and
				we will reach out - you do not have to.
			</p>
		</div>
		<Button href="/suggest-a-shop" variant="onDark" size="lg">Suggest a shop</Button>
	</div>
</Section>
