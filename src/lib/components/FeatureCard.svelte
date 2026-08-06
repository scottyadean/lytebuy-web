<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		/** One of the keys in `icons` below. */
		icon?: keyof typeof icons;
		onDark?: boolean;
		children: Snippet;
	}

	let { title, icon, onDark = false, children }: Props = $props();

	// Inline so a five-icon feature grid costs no extra requests. Stroked to sit
	// alongside the type rather than compete with it.
	const icons = {
		map: 'M9 3 3 5.5v16L9 19l6 2.5 6-2.5v-16L15 5.5 9 3zm0 0v16m6-13.5v16',
		bell: 'M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7M13.7 20a2 2 0 0 1-3.4 0',
		page: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7zm0 0v7h7M8 13h8M8 17h5',
		tag: 'M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01',
		chart: 'M3 3v18h18M7 15v3M12 10v8M17 6v12'
	} as const;
</script>

<div>
	{#if icon}
		<div
			class="mb-5 flex h-11 w-11 items-center justify-center rounded-[3px]
			       {onDark ? 'bg-white/10 text-thistle' : 'bg-accent-soft text-accent'}"
		>
			<svg
				viewBox="0 0 24 24"
				class="h-5 w-5"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d={icons[icon]} />
			</svg>
		</div>
	{/if}

	<h3 class="mb-2.5 font-display text-xl {onDark ? 'text-white' : 'text-iron'}">{title}</h3>
	<p class="text-[0.9375rem] leading-relaxed {onDark ? 'text-dust' : 'text-charcoal'}">
		{@render children()}
	</p>
</div>
