<script lang="ts">
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { contact } from '$lib/config';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const values = $derived(form && 'values' in form ? form.values : undefined);

	// "Suggest a shop" sends people to the dedicated page rather than adding a
	// fifth option here - it needs its own wording, not just a different value.
	const interests = [
		{ value: 'sell', label: 'I want to sell on lytebuy' },
		{ value: 'invest', label: 'I am an investor' },
		{ value: 'press', label: 'I am press' },
		{ value: 'other', label: 'Something else' }
	];
</script>

<Seo
	title="Get involved"
	description="Sell on Lytebuy, invest, or just say hello. Tell us a little about you and we will come back to you."
/>

<Section tone="surface" space="md">
	<div class="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
		<div>
			<Eyebrow>Get involved</Eyebrow>
			<h1 class="text-display leading-[1.05]">Come and build main street with us.</h1>
			<p class="mt-6 text-lg leading-relaxed">
				If you make something, sell something, cook something or teach something in your town, there
				is a place for you here. Listing is free.
			</p>
			

			<hr class="mt-5" />

			<p class="mt-6 text-lg leading-relaxed">
				If you are are interested in promoting local shopping in your home town please reach out we would love to onboard your vendors. 
			</p>
			


			<dl class="mt-12 space-y-6 border-t border-dust pt-8">
				<div>
					<dt class="text-sm tracking-wide text-granite uppercase">Contact Us</dt>
					<dd class="mt-1">
						<a
							href="mailto:{contact.email}"
							class="text-accent underline underline-offset-4"
						>
							{contact.email}
						</a>
					</dd>
				</div>

				<div>
					<dt class="text-sm tracking-wide text-granite uppercase">Where We Are</dt>
					<dd class="mt-1">{contact.town} ({contact.timezone})</dd>
				</div>
			</dl>
		</div>

		<div id="contact" class="border border-dust bg-canvas p-7 md:p-10">
			{#if form?.success}
				<div class="py-10 text-center">
					<h2 class="text-title">Thank you!</h2>
					<p class="mt-4 leading-relaxed">
						We read everything ourselves, so it may take a day or two. If it is urgent, email
						<a href="mailto:{contact.email}" class="text-accent underline underline-offset-4">
							{contact.email}
						</a>.
					</p>
				</div>
			{:else}
				<EnquiryForm
					{errors}
					{values}
					options={interests}
					interest="sell"
					heading="Tell us about you"
					businessLabel="Business"
					businessHint="optional"
					messageLabel="Message"
					messagePlaceholder="What do you make, sell or want to ask?"
					submitLabel="Send it"
				/>
			{/if}
		</div>
	</div>
</Section>
