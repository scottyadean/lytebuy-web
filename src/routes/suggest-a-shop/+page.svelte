<script lang="ts">
	// The third path off /promote-your-town. Vendor and lyte bearer both ask you
	// to do something ongoing; this one asks for a single name, from someone who
	// has no intention of joining but knows the shop that should be here. It
	// posts interest=suggest so the admin inbox can filter these out as leads to
	// approach rather than replies to write.
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { contact } from '$lib/config';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const values = $derived(form && 'values' in form ? form.values : undefined);

	// "Suggest a shop" leads because it is why the page exists; the other two
	// are here so someone who arrived by mistake is not stuck.
	const options = [
		{ value: 'suggest', label: 'Suggest a shop' },
		{ value: 'sell', label: 'I want to sell on lytebuy' },
		{ value: 'other', label: 'Something else' }
	];

	const reasons = [
		{
			title: 'We approach them, not you',
			body: 'You do not have to talk to the owner or explain what lytebuy is. Give us the name and we take it from there.'
		},
		{
			title: 'It stays free for them',
			body: 'Listing costs a vendor nothing. You are not signing your favourite shop up to a bill.'
		},
		{
			title: 'One name is enough',
			body: 'If all you know is "the bakery on Main Street", that is plenty to go on.'
		}
	];
</script>

<Seo
	title="Suggest a shop"
	description="Know a local shop that should be on Lytebuy? Tell us who they are and we will reach out. Listing is free for them, and takes nothing from you."
/>

<Section tone="surface" space="md">
	<div class="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
		<div>
			<Eyebrow>Suggest a shop</Eyebrow>
			<h1 class="text-display leading-[1.05]">
				Know a shop that
				<span class="block italic text-accent">should be here?</span>
			</h1>
			<p class="mt-6 text-lg leading-relaxed">
				The baker who never posts online. The mechanic everyone recommends. Tell us who they
				are and we will reach out - you do not have to.
			</p>

			<dl class="mt-12 space-y-6 border-t border-dust pt-8">
				{#each reasons as reason (reason.title)}
					<div>
						<dt class="font-display text-base text-iron">{reason.title}</dt>
						<dd class="mt-1 leading-relaxed">{reason.body}</dd>
					</div>
				{/each}
			</dl>

			<p class="mt-10 text-sm leading-relaxed text-granite">
				Would rather email? <a
					href="mailto:{contact.email}"
					class="text-accent underline underline-offset-4">{contact.email}</a
				>
			</p>
		</div>

		<div id="suggest" class="border border-dust bg-canvas p-7 md:p-10">
			{#if form?.success}
				<div class="py-10 text-center">
					<h2 class="text-title">Thank you!</h2>
					<p class="mt-4 leading-relaxed">
						We will take a look and reach out to them. If you think of another one, the form
						is right here whenever you are ready.
					</p>
					<p class="mt-6">
						<a href="/suggest-a-shop" class="text-accent underline underline-offset-4">
							Suggest another shop
						</a>
					</p>
				</div>
			{:else}
				<EnquiryForm
					{errors}
					{values}
					{options}
					interest="suggest"
					heading="Tell us about the shop"
					nameLabel="Your name"
					businessLabel="Business"
					businessHint="the shop you are suggesting"
					messageLabel="Message"
					messagePlaceholder="Where are they, and what are they known for?"
					submitLabel="Send it"
					note="We use this only to follow up on the suggestion. No list, no resale, no third parties."
				/>
			{/if}
		</div>
	</div>
</Section>
