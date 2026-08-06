<script lang="ts">
	interface Props {
		/** Inverts the wordmark for dark bands. */
		onDark?: boolean;
		class?: string;
	}

	let { onDark = false, class: extra = '' }: Props = $props();
</script>

<span class="inline-flex items-center gap-2.5 {extra}">
	<!-- The isometric cube from lytebuy-logo.svg, redrawn inline so it inherits
	     currentColor and needs no network request in the nav. -->
	<svg
		viewBox="0 0 32 34"
		class="h-7 w-auto shrink-0"
		aria-hidden="true"
		fill="none"
	>
		<path d="M16 1 31 9.5v15L16 33 1 24.5v-15z" fill={onDark ? '#beb2c8' : '#685577'} />
		<path d="M16 1 31 9.5 16 18 1 9.5z" fill={onDark ? '#d7d6d6' : '#8d8d92'} />
		<path d="M16 18v15L1 24.5v-15z" fill={onDark ? '#8d8d92' : '#36413e'} opacity="0.75" />
	</svg>
	<span
		class="font-display text-xl font-semibold tracking-tight {onDark
			? 'text-white'
			: 'text-iron'}">lytebuy</span
	>
</span>
