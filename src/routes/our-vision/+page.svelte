<script lang="ts">
	// LB-Web-7. "Our vision" moved off /who-we-are onto its own footer-linked
	// page. The copy is unchanged from where it lived before; only the wrapper
	// changed - what was an <h2> inside a longer page is the <h1> here, since it
	// is now the page's own subject.
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Lantern from '$lib/components/Lantern.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Our vision"
	description="Reconnecting people to communities. Why Lytebuy exists, and the local economies we want to see."
/>

<Section tone="surface">
	<div class="mx-auto max-w-3xl">
		<Reveal>
			<Eyebrow>Our vision</Eyebrow>

			<h1 class="text-display leading-[1.05]">Reconnecting people to communities.</h1>
			<div class="mx-auto max-w-80"><Lantern variant="full" class="auto" /></div>
			<div class="mt-8 space-y-5 text-lg leading-relaxed">
				<p>
					In the heart of every town, unique local vendors breathe life into the community. Somewhere
					along the way it became easier to buy from a warehouse a thousand miles away than from the
					person two streets over.
				</p>

				<p>
					When you buy on lytebuy more money goes to the vendor. We charge substantially less than
					other platforms.
				</p>

				<p>
					Lytebuy is a low-cost digital marketplace where small businesses showcase their speciality
					to the millions of people passing. Let people know what your main street is famous for, and
					we will put you on the map.
				</p>
				<p class="font-display text-xl text-iron italic">
					We want vibrant local economies where small businesses prosper and people enjoy better
					things. Dream big, share love, enjoy life, support one another. That is the whole idea.
				</p>
			</div>
		</Reveal>
	</div>
</Section>

<!-- The vision claims we charge less than other platforms; the evidence for it
     now lives on /who-we-are, so send the reader there rather than leaving the
     claim hanging on a page of its own. -->
<Section tone="canvas" space="md">
	<div class="mx-auto flex max-w-3xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
		<div>
			<h2 class="text-title">See what that costs a vendor.</h2>
			<p class="mt-3 max-w-lg leading-relaxed">
				We compare our fee with Etsy, eBay, Amazon Handmade and Groupon, using each platform's
				own published schedule.
			</p>
		</div>
		<div class="flex flex-wrap gap-3">
			<Button href="/who-we-are" size="lg">Who we are</Button>
			<Button href="/sell" variant="secondary" size="lg">Start selling</Button>
		</div>
	</div>
</Section>
