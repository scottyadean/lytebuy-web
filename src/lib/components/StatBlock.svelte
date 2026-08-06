<script lang="ts">
	interface Stat {
		value: string;
		label: string;
		/** Marks a figure as illustrative rather than measured. */
		note?: string;
	}

	interface Props {
		stats: Stat[];
		onDark?: boolean;
	}

	let { stats, onDark = false }: Props = $props();
</script>

<dl class="grid gap-10 sm:grid-cols-3">
	{#each stats as stat (stat.label)}
		<div>
			<dt class="sr-only">{stat.label}</dt>
			<dd>
				<span
					class="block font-display text-display leading-none
					       {onDark ? 'text-white' : 'text-iron'}"
				>
					{stat.value}
				</span>
				<span
					class="mt-3 block text-sm leading-relaxed {onDark ? 'text-dust' : 'text-charcoal'}"
				>
					{stat.label}
				</span>
				{#if stat.note}
					<span class="mt-1 block text-xs {onDark ? 'text-granite' : 'text-granite'}">
						{stat.note}
					</span>
				{/if}
			</dd>
		</div>
	{/each}
</dl>
