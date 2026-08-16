<script lang="ts">
	import Lantern from './Lantern.svelte';

	interface Props {
		/** Inverts the wordmark and lantern ink for dark bands. */
		onDark?: boolean;
		class?: string;
	}

	let { onDark = false, class: extra = '' }: Props = $props();
</script>

<span class="inline-flex items-center gap-2.5 {extra}">
	<!-- Lantern-only crop reads better than the full mark at nav size. -->
	<Lantern variant="crop" {onDark} class="h-8 w-auto shrink-0" />
	<span
		class="font-display text-xl font-semibold tracking-tight {onDark
			? 'text-white'
			: 'text-iron'}">lytebuy</span
	>
</span>
