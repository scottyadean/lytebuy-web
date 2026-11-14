<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';

	interface Props {
		title: string;
		description: string;
		/** Sanitized on the server by renderMarkdown. */
		html: string;
	}

	let { title, description, html }: Props = $props();
</script>

<!-- Indexable, unlike the marketing pages these replaced: the app stores are
     given these URLs and a noindex policy page is a poor signal. -->
<Seo {title} {description} />

<Section tone="surface" space="md">
	<div class="mx-auto max-w-3xl">
		<h1 class="text-display leading-[1.05]">{title}</h1>
		<!-- No contact block is appended: each document already ends with its own
		     contact section, and the tax document has its own "Questions" heading. -->
		<div class="prose-lytebuy mt-8">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</div>
	</div>
</Section>
