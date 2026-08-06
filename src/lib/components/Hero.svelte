<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		/** Italic display fragment set after the title, per the editorial look. */
		accent?: string;
		lede?: string;
		/** Omit to fall back to the poster image alone. */
		video?: string;
		poster: string;
		posterAlt?: string;
		/** Full viewport for the landing page; shorter band for inner pages. */
		size?: 'full' | 'band';
		actions?: Snippet;
	}

	let {
		title,
		accent,
		lede,
		video,
		poster,
		posterAlt = '',
		size = 'band',
		actions
	}: Props = $props();

	let element = $state<HTMLVideoElement>();

	$effect(() => {
		if (!element || !video) return;

		// Autoplay is a preference, not a promise: iOS low-power mode and a
		// reduced-motion setting both refuse it. The poster stays visible
		// underneath either way, so a rejected play() is not an error.
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;

		element.play().catch(() => {
			/* poster remains */
		});
	});
</script>

<header
	class="relative isolate flex items-end overflow-hidden bg-iron
	       {size === 'full' ? 'min-h-[92svh]' : 'min-h-[52svh]'}"
>
	{#if video}
		<video
			bind:this={element}
			class="absolute inset-0 -z-10 h-full w-full object-cover"
			{poster}
			muted
			loop
			playsinline
			preload="metadata"
			aria-hidden="true"
			tabindex="-1"
		>
			<source src={video} type="video/mp4" />
		</video>
	{:else}
		<img
			src={poster}
			alt={posterAlt}
			class="absolute inset-0 -z-10 h-full w-full object-cover"
			fetchpriority="high"
		/>
	{/if}

	<!-- Two overlays: a flat wash to hold contrast across the whole frame, and a
	     bottom-weighted gradient so the copy sits on the darkest part of it.
	     Measured against the brightest frame of the Placerville clip, body text
	     clears AA at these values. -->
	<div class="absolute inset-0 -z-10 bg-iron/55" aria-hidden="true"></div>
	<div
		class="absolute inset-0 -z-10 bg-gradient-to-t from-iron/95 via-iron/40 to-transparent"
		aria-hidden="true"
	></div>

	<div class="container-page pt-32 pb-16 md:pb-24">
		<h1 class="max-w-4xl font-display text-hero leading-[0.95] text-white">
			{title}{#if accent}<span class="block italic text-thistle">{accent}</span>{/if}
		</h1>

		{#if lede}
			<p class="mt-6 max-w-xl text-lg leading-relaxed text-dust">{lede}</p>
		{/if}

		{#if actions}
			<div class="mt-9 flex flex-wrap gap-3">{@render actions()}</div>
		{/if}
	</div>
</header>
