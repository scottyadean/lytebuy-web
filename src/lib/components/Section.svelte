<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'surface' | 'canvas' | 'iron' | 'accent';
	type Space = 'md' | 'lg';

	interface Props {
		tone?: Tone;
		space?: Space;
		id?: string;
		/** Drop the inner container when a child needs to run full-bleed. */
		bleed?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		tone = 'surface',
		space = 'lg',
		id,
		bleed = false,
		class: extra = '',
		children
	}: Props = $props();

	const tones: Record<Tone, string> = {
		surface: 'bg-surface text-charcoal',
		canvas: 'bg-canvas text-charcoal',
		// Dark band. Headings inside inherit white via the [&_h2] rules rather
		// than every caller remembering to set a colour.
		iron: 'bg-iron text-dust [&_h2]:text-white [&_h3]:text-white',
		accent: 'bg-accent-soft text-charcoal'
	};

	const spaces: Record<Space, string> = {
		md: 'py-16 md:py-20',
		lg: 'py-20 md:py-28'
	};
</script>

<section {id} class="{tones[tone]} {spaces[space]} {extra}">
	{#if bleed}
		{@render children()}
	{:else}
		<div class="container-page">
			{@render children()}
		</div>
	{/if}
</section>
