<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Stagger, in ms, for items revealed as a group. */
		delay?: number;
		class?: string;
		children: Snippet;
	}

	let { delay = 0, class: extra = '', children }: Props = $props();

	let element = $state<HTMLDivElement>();
	let visible = $state(false);

	$effect(() => {
		if (!element) return;

		// No IntersectionObserver (or an old browser): show it immediately rather
		// than leaving the section permanently invisible.
		if (typeof IntersectionObserver === 'undefined') {
			visible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visible = true;
						// One-shot: re-animating on every scroll past is noise.
						observer.disconnect();
					}
				}
			},
			// Pre-trigger well before the element reaches the viewport. Firing on
			// actual intersection meant anyone scrolling at a normal speed arrived
			// at a section that was still blank and waiting to fade in.
			{ rootMargin: '0px 0px 240px 0px', threshold: 0 }
		);

		observer.observe(element);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class="reveal {extra}"
	class:is-visible={visible}
	style={delay ? `transition-delay:${delay}ms` : undefined}
>
	{@render children()}
</div>
