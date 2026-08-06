<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Inverts to read on the iron and photographic bands. */
		onDark?: boolean;
		children: Snippet;
	}

	let { onDark = false, children }: Props = $props();
</script>

<!-- The deck's three-dash motif, reused as the standard section label. -->
<p
	class="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase
	       {onDark ? 'text-thistle' : 'text-accent'}"
>
	<span
		class="h-px w-8 {onDark ? 'bg-thistle' : 'bg-accent'}"
		aria-hidden="true"
	></span>
	{@render children()}
</p>
