<script lang="ts">
	interface Props {
		name: string;
		trade: string;
		town: string;
		/** Absent until the vendor directory is wired to the API. */
		image?: string;
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
		<p class="truncate text-sm text-charcoal">{trade}</p>
		<p class="truncate text-xs text-granite">{town}</p>
	</div>
</div>
