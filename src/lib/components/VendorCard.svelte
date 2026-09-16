<script lang="ts">
	interface Props {
		name: string;
		/** What kind of business. Optional: the API returns null when the vendor
		 *  has not set a business type. */
		trade?: string | null;
		/** Town from the vendor's active location, null when none is pinned. */
		town?: string | null;
		image?: string | null;
	}

	let { name, trade, town, image }: Props = $props();

	// Deterministic monogram tint so a directory without photography still reads
	// as a set of distinct businesses rather than a wall of identical tiles.
	const tints = ['bg-accent-soft text-accent', 'bg-dust text-iron', 'bg-thistle/40 text-iron'];
	const tint = $derived(tints[name.charCodeAt(0) % tints.length]);
	const initials = $derived(
		name
			.split(' ')
			.slice(0, 2)
			.map((word) => word[0])
			.join('')
			.toUpperCase()
	);
</script>

<div class="flex items-center gap-4 border border-dust bg-surface p-4 transition-shadow hover:shadow-lift">
	{#if image}
		<img src={image} alt="" loading="lazy" class="h-14 w-14 shrink-0 object-cover" />
	{:else}
		<div
			class="flex h-14 w-14 shrink-0 items-center justify-center font-display text-lg {tint}"
			aria-hidden="true"
		>
			{initials}
		</div>
	{/if}

	<div class="min-w-0">
		<p class="truncate font-medium text-iron">{name}</p>
		{#if trade}
			<p class="truncate text-sm text-charcoal">{trade}</p>
		{/if}
		{#if town}
			<p class="truncate text-xs text-granite">{town}</p>
		{/if}
	</div>
</div>
