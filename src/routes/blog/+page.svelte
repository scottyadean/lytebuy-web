<script lang="ts">
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="Blog"
	description="Notes on local commerce, small business and why main street is worth the detour."
	noindex={data.page > 1}
/>

<Section tone="surface" space="md">
	<Reveal>
		<Eyebrow>The blog</Eyebrow>
		<h1 class="max-w-3xl text-display leading-[1.05]">
			Notes from main street.
		</h1>
		<p class="mt-6 max-w-xl text-lg leading-relaxed">
			Why local commerce is worth defending, what we are building, and the shops keeping their
			towns interesting.
		</p>
	</Reveal>
</Section>

<Section tone="canvas" space="md">
	{#if data.posts.length}
		<div class="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
			{#each data.posts as post, index (post.id)}
				<Reveal delay={(index % 3) * 80}>
					<PostCard {post} featured={data.page === 1 && index === 0} />
				</Reveal>
			{/each}
		</div>

		{#if data.pageCount > 1}
			<nav class="mt-16 flex items-center justify-between border-t border-dust pt-8" aria-label="Pagination">
				{#if data.page > 1}
					<a
						href="/blog?page={data.page - 1}"
						class="text-sm font-medium text-accent hover:text-iron"
						rel="prev"
					>
						<span aria-hidden="true">&larr;</span> Newer
					</a>
				{:else}
					<span></span>
				{/if}

				<span class="text-sm text-granite">Page {data.page} of {data.pageCount}</span>

				{#if data.page < data.pageCount}
					<a
						href="/blog?page={data.page + 1}"
						class="text-sm font-medium text-accent hover:text-iron"
						rel="next"
					>
						Older <span aria-hidden="true">&rarr;</span>
					</a>
				{:else}
					<span></span>
				{/if}
			</nav>
		{/if}
	{:else}
		<!-- Also what a reader sees if the blog service is unreachable, which is a
		     better outcome for a marketing page than a 500. -->
		<div class="mx-auto max-w-md py-16 text-center">
			<h2 class="text-title">Nothing published yet.</h2>
			<p class="mt-4 leading-relaxed">
				The first posts are being written. Come back shortly, or
				<a href="/get-involved" class="text-accent underline underline-offset-4">say hello</a>
				in the meantime.
			</p>
		</div>
	{/if}
</Section>
