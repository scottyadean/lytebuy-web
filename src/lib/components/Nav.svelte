<script lang="ts">
	import { page } from '$app/state';
	import { appLinks, nav } from '$lib/config';
	import Button from './Button.svelte';
	import Logo from './Logo.svelte';

	interface Props {
		/** Landing and other photo-led pages put the nav over the hero. */
		overlay?: boolean;
	}

	let { overlay = false }: Props = $props();

	let scrolled = $state(false);
	let open = $state(false);

	// Solid chrome once the hero is behind us; transparent while over it. An
	// overlay nav that never solidifies becomes unreadable over pale content.
	const solid = $derived(!overlay || scrolled);

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 24);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Close the mobile drawer on navigation, otherwise it stays open over the
	// new page.
	$effect(() => {
		page.url.pathname;
		open = false;
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') open = false;
	}}
/>

<nav
	class="fixed inset-x-0 top-0 z-50 transition-colors duration-300
	       {solid ? 'border-b border-dust bg-surface/95 backdrop-blur' : 'bg-transparent'}"
	aria-label="Main"
>
	<div class="container-page flex h-16 items-center justify-between gap-6 md:h-20">
		<a href="/" class="shrink-0" aria-label="Lytebuy home">
			<Logo onDark={!solid} />
		</a>

		<ul class="hidden items-center gap-8 lg:flex">
			{#each nav as item (item.href)}
				{@const active = page.url.pathname.startsWith(item.href)}
				<li>
					<a
						href={item.href}
						aria-current={active ? 'page' : undefined}
						class="text-sm transition-colors
						       {solid
							? active
								? 'text-iron font-medium'
								: 'text-charcoal hover:text-iron'
							: active
								? 'text-white font-medium'
								: 'text-dust hover:text-white'}"
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="hidden items-center gap-3 lg:flex">
			<Button href="/sell" variant={solid ? 'secondary' : 'onDark'} size="md">
				Start selling
			</Button>
			<Button href={appLinks.web} variant={solid ? 'primary' : 'onDark'} size="md">
				Open the app
			</Button>
		</div>

		<button
			type="button"
			class="lg:hidden {solid ? 'text-iron' : 'text-white'}"
			aria-expanded={open}
			aria-controls="mobile-nav"
			onclick={() => (open = !open)}
		>
			<span class="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
			<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
				{#if open}
					<path d="M6 6l12 12M18 6L6 18" />
				{:else}
					<path d="M3 7h18M3 12h18M3 17h18" />
				{/if}
			</svg>
		</button>
	</div>

	{#if open}
		<div id="mobile-nav" class="border-t border-dust bg-surface lg:hidden">
			<ul class="container-page flex flex-col py-4">
				{#each nav as item (item.href)}
					<li>
						<a href={item.href} class="block py-3 text-base text-iron">{item.label}</a>
					</li>
				{/each}
			</ul>
			<div class="container-page flex flex-col gap-3 pb-6">
				<Button href="/sell" variant="secondary" full>Start selling</Button>
				<Button href={appLinks.web} variant="primary" full>Open the app</Button>
			</div>
		</div>
	{/if}
</nav>
