<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark';
	type Size = 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		full?: boolean;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		full = false,
		class: extra = '',
		children,
		...rest
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 font-medium tracking-wide ' +
		'transition-colors duration-200 rounded-[3px] ' +
		'disabled:opacity-50 disabled:pointer-events-none';

	const variants: Record<Variant, string> = {
		primary: 'bg-iron text-white hover:bg-iron-soft',
		secondary: 'bg-transparent text-iron border border-iron hover:bg-iron hover:text-white',
		ghost: 'bg-transparent text-accent hover:text-iron underline underline-offset-4',
		// Sits on photography or the video hero. Solid white reads at any exposure;
		// a translucent fill would wash out against the brighter frames.
		onDark: 'bg-white text-iron hover:bg-dust'
	};

	const sizes: Record<Size, string> = {
		md: 'px-5 py-2.5 text-sm',
		lg: 'px-7 py-3.5 text-base'
	};

	// `ghost` is a text link, so the button padding would misalign it.
	const padding = $derived(variant === 'ghost' ? 'text-sm' : sizes[size]);
	const classes = $derived(
		[base, variants[variant], padding, full ? 'w-full' : '', extra].filter(Boolean).join(' ')
	);
</script>

{#if href}
	<a {href} class={classes} {...rest as HTMLAnchorAttributes}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class={classes} {...rest as HTMLButtonAttributes}>
		{@render children()}
	</button>
{/if}
