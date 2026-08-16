<script lang="ts">
	import { formatDate, isoDate } from '$lib/format';
	import type { PostSummary } from '$lib/server/blog';

	interface Props {
		post: PostSummary;
		/** Route prefix: /blog or /press. */
		base?: string;
		/** First card in a feed gets the larger treatment. */
		featured?: boolean;
	}

	let { post, base = '/blog', featured = false }: Props = $props();

	const href = $derived(`${base}/${post.slug}`);
</script>

<article class="group flex h-full flex-col">
	<a {href} class="block overflow-hidden bg-canvas {featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}">
		{#if post.cover_image_url}
			<img
				src={post.cover_image_url}
				alt=""
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
			/>
		{:else}
			<!-- No cover: a tinted well keeps the grid rhythm instead of collapsing
			     the card to text only. -->
			<div class="flex h-full w-full items-center justify-center bg-accent-soft">
				<span class="font-display text-2xl text-accent">lytebuy</span>
			</div>
		{/if}
	</a>

	<div class="flex flex-1 flex-col pt-5">
		<div class="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-granite">
			<time datetime={isoDate(post.created_date)}>{formatDate(post.created_date)}</time>
			{#if post.tags.length}
				<span aria-hidden="true">·</span>
				<span class="text-accent">{post.tags[0]}</span>
			{/if}
		</div>

		<h3 class="font-display {featured ? 'text-title' : 'text-xl'} leading-snug">
			<a {href} class="transition-colors hover:text-accent">{post.title}</a>
		</h3>

		{#if post.excerpt}
			<p class="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-charcoal">
				{post.excerpt}
			</p>
		{/if}

		<p class="mt-4 text-sm font-medium text-accent">
			<a {href}>Read more <span aria-hidden="true">&rarr;</span></a>
		</p>
	</div>
</article>
