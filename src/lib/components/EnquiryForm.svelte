<script lang="ts">
	/** The shared body of the two public enquiry forms (/get-involved and
	 *  /suggest-a-shop).
	 *
	 *  The fields, the honeypot, the error rendering and the submitting state are
	 *  identical on both; only the wording and the "I am here to" options differ.
	 *  Those come in as props so the markup exists once. */
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';

	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		/** Field-level errors from the action, keyed by input name. */
		errors?: Record<string, string>;
		/** What the person typed, so a rejected submission is not retyped. */
		values?: Record<string, string>;
		options: Option[];
		/** Preselected "I am here to" value. */
		interest: string;
		heading: string;
		nameLabel?: string;
		businessLabel: string;
		businessHint?: string;
		interestLabel?: string;
		messageLabel: string;
		messagePlaceholder: string;
		submitLabel: string;
		/** Reassurance under the button. */
		note?: string;
	}

	let {
		errors,
		values,
		options,
		interest,
		heading,
		nameLabel = 'Your name',
		businessLabel,
		businessHint,
		interestLabel = 'I am here to',
		messageLabel,
		messagePlaceholder,
		submitLabel,
		note = 'We use this only to reply to you. No list, no resale, no third parties.'
	}: Props = $props();

	let submitting = $state(false);

	const field =
		'mt-2 w-full border border-dust bg-surface px-4 py-3 text-[0.9375rem] text-iron ' +
		'placeholder:text-granite focus:border-accent focus:outline-none';
</script>

<h2 class="text-title">{heading}</h2>

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
		<label for="name" class="text-sm font-medium text-iron">{nameLabel}</label>
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
			{businessLabel}
			{#if businessHint}<span class="text-granite">({businessHint})</span>{/if}
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
		<label for="interest" class="text-sm font-medium text-iron">{interestLabel}</label>
		<select id="interest" name="interest" class={field} value={values?.interest ?? interest}>
			{#each options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		{#if errors?.interest}
			<p class="mt-1.5 text-sm text-[#b3261e]">{errors.interest}</p>
		{/if}
	</div>

	<div>
		<label for="message" class="text-sm font-medium text-iron">{messageLabel}</label>
		<textarea
			id="message"
			name="message"
			rows="5"
			required
			placeholder={messagePlaceholder}
			aria-invalid={errors?.message ? 'true' : undefined}
			aria-describedby={errors?.message ? 'message-error' : undefined}
			class={field}>{values?.message ?? ''}</textarea
		>
		{#if errors?.message}
			<p id="message-error" class="mt-1.5 text-sm text-[#b3261e]">{errors.message}</p>
		{/if}
	</div>

	<!-- A whole-form failure (the API was unreachable, LB-6.7). Without this the
	     submission would fail silently and the person would be left staring at an
	     unchanged form. -->
	{#if errors?.form}
		<p class="rounded-[3px] border border-[#b3261e] p-3 text-sm text-[#b3261e]" role="alert">
			{errors.form}
		</p>
	{/if}

	<Button type="submit" size="lg" full disabled={submitting}>
		{submitting ? 'Sending…' : submitLabel}
	</Button>

	<p class="text-xs leading-relaxed text-granite">{note}</p>
</form>
