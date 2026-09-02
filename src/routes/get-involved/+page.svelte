<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact } from '$lib/config';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const values = $derived(form && 'values' in form ? form.values : undefined);

	const field =
		'mt-2 w-full border border-dust bg-surface px-4 py-3 text-[0.9375rem] text-iron ' +
		'placeholder:text-granite focus:border-accent focus:outline-none';

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
				<h2 class="text-title">Tell us about you</h2>

				<form
					method="POST"
					class="mt-8 space-y-6"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<!-- Bot trap. Hidden from sight and from screen readers, and never
					     focusable, so no real visitor can fill it in by accident. -->
					<div class="hidden" aria-hidden="true">
						<label for="website">Website</label>
						<input id="website" name="website" type="text" tabindex="-1" autocomplete="off" />
					</div>

					<div>
						<label for="name" class="text-sm font-medium text-iron">Your name</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							autocomplete="name"
							value={values?.name ?? ''}
							aria-invalid={errors?.name ? 'true' : undefined}
							aria-describedby={errors?.name ? 'name-error' : undefined}
							class={field}
						/>
						{#if errors?.name}
							<p id="name-error" class="mt-1.5 text-sm text-[#b3261e]">{errors.name}</p>
						{/if}
					</div>

					<div>
						<label for="email" class="text-sm font-medium text-iron">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							autocomplete="email"
							value={values?.email ?? ''}
							aria-invalid={errors?.email ? 'true' : undefined}
							aria-describedby={errors?.email ? 'email-error' : undefined}
							class={field}
						/>
						{#if errors?.email}
							<p id="email-error" class="mt-1.5 text-sm text-[#b3261e]">{errors.email}</p>
						{/if}
					</div>

					<div>
						<label for="business" class="text-sm font-medium text-iron">
							Business <span class="text-granite">(optional)</span>
						</label>
						<input
							id="business"
							name="business"
							type="text"
							autocomplete="organization"
							value={values?.business ?? ''}
							class={field}
						/>
					</div>

					<div>
						<label for="interest" class="text-sm font-medium text-iron">I am here to</label>
						<select id="interest" name="interest" class={field} value={values?.interest ?? 'sell'}>
							{#each interests as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="message" class="text-sm font-medium text-iron">Message</label>
						<textarea
							id="message"
							name="message"
							rows="5"
							required
							placeholder="What do you make, sell or want to ask?"
							aria-invalid={errors?.message ? 'true' : undefined}
							aria-describedby={errors?.message ? 'message-error' : undefined}
							class={field}>{values?.message ?? ''}</textarea
						>
						{#if errors?.message}
							<p id="message-error" class="mt-1.5 text-sm text-[#b3261e]">{errors.message}</p>
						{/if}
					</div>

					<Button type="submit" size="lg" full disabled={submitting}>
						{submitting ? 'Sending…' : 'Send it'}
					</Button>

					<p class="text-xs leading-relaxed text-granite">
						We use this only to reply to you. No list, no resale, no third parties.
					</p>
				</form>
			{/if}
		</div>
	</div>
</Section>
