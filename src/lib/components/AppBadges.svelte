<script lang="ts">
	import { appLinks } from '$lib/config';

	interface Props {
		onDark?: boolean;
		class?: string;
	}

	let { onDark = false, class: extra = '' }: Props = $props();

	const stores = [
		{
			href: appLinks.ios,
			eyebrow: 'Download on the',
			name: 'App Store',
			// Apple mark
			path: 'M17.05 12.54c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.79-.41 6.92 1.16 9.18.77 1.11 1.68 2.35 2.88 2.3 1.16-.05 1.6-.74 3-.74s1.79.74 3.01.72c1.24-.02 2.03-1.12 2.79-2.24.88-1.28 1.24-2.52 1.26-2.58-.03-.01-2.41-.92-2.44-3.66zM14.79 5.4c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.78-.97 2.83 1.03.08 2.07-.52 2.71-1.29z'
		},
		{
			href: appLinks.android,
			eyebrow: 'Get it on',
			name: 'Google Play',
			// Play triangle
			path: 'M3.6 2.4c-.3.3-.5.8-.5 1.4v16.4c0 .6.2 1.1.5 1.4l.1.1 9.2-9.2v-.2L3.7 2.3l-.1.1zm12.3 6.1L5.8 2.7l-.1-.1 8.6 8.6 1.6-1.6v-.1zM4.6 21.4l10.1-5.8-1.6-1.6-8.6 8.6.1-.1zm12.4-7.1 2.4-1.4c.7-.4.7-1.4 0-1.8l-2.4-1.4-1.8 1.8 1.8 1.8z'
		}
	];
</script>

<div class="flex flex-wrap gap-3 {extra}">
	{#each stores as store (store.name)}
		{@const pending = !store.href}
		<!-- Until the listings exist these are non-interactive rather than dead
		     links: a badge that 404s costs more trust than one that says "soon". -->
		<svelte:element
			this={pending ? 'div' : 'a'}
			href={store.href || undefined}
			aria-disabled={pending ? 'true' : undefined}
			class="inline-flex items-center gap-3 rounded-[3px] border px-4 py-2.5 transition-colors
			       {onDark
				? 'border-white/25 text-white ' + (pending ? 'opacity-60' : 'hover:bg-white/10')
				: 'border-iron/25 text-iron ' + (pending ? 'opacity-50' : 'hover:bg-iron hover:text-white')}"
		>
			<svg viewBox="0 0 24 24" class="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
				<path d={store.path} />
			</svg>
			<span class="text-left leading-tight">
				<span class="block text-[0.625rem] tracking-wide uppercase opacity-75">
					{pending ? 'Coming soon to' : store.eyebrow}
				</span>
				<span class="block text-sm font-medium">{store.name}</span>
			</span>
		</svelte:element>
	{/each}
</div>
