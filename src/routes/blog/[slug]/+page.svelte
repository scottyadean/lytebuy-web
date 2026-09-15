<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/config';
	import { formatCount, formatDate, isoDate, readingMinutes } from '$lib/format';
	import { recordView } from '$lib/views';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const origin = $derived((env.PUBLIC_SITE_URL || site.url).replace(/\/$/, ''));
	const minutes = $derived(readingMinutes(data.post.body));

	// The loaded count is before this view; recording the view returns the
	// incremented count so the reader sees their own visit. bumped holds that
	// result when it arrives and falls back to the loaded value until then.
	let bumped = $state<number | null>(null);
	const views = $derived(bumped ?? data.post.views);

	// Keyed on the post id so a client-side navigation to another post records a
	// fresh view (onMount would fire only once for the reused component). Reset
	// first so the new post never briefly shows the previous post's bumped count.
	$effect(() => {
		const id = data.post.id;
		bumped = null;
		recordView('post', id).then((updated) => {
			if (updated !== null) bumped = updated;
		});
	});
</script>

<Seo
	title={data.post.title}
	description={data.description}
	image={data.post.cover_image_url ?? undefined}
	type="article"
	publishedAt={isoDate(data.post.created_date)}
	modifiedAt={isoDate(data.post.updated_date)}
	author={data.post.author}
	schema={{
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.post.title,
		description: data.description,
		datePublished: isoDate(data.post.created_date),
		dateModified: isoDate(data.post.updated_date),
		author: { '@type': 'Person', name: data.post.author },
		publisher: { '@type': 'Organization', name: site.name },
		mainEntityOfPage: `${origin}/blog/${data.post.slug}`,
		...(data.post.cover_image_url ? { image: data.post.cover_image_url } : {})
	}}
/>

<article>
	<Section tone="surface" space="md">
		<div class="mx-auto max-w-3xl">
			<a href="/blog" class="text-sm text-accent hover:text-iron">
				<span aria-hidden="true">&larr;</span> All posts
			</a>

			<h1 class="mt-6 text-display leading-[1.05]">{data.post.title}</h1>

			<div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-granite">
				<span>{data.post.author}</span>
				<span aria-hidden="true">·</span>
				<time datetime={isoDate(data.post.created_date)}>
					{formatDate(data.post.created_date)}
				</time>
				<span aria-hidden="true">·</span>
				<span>{minutes} min read</span>
				<span aria-hidden="true">·</span>
				<span>{formatCount(views)} {views === 1 ? 'view' : 'views'}</span>
			</div>

			{#if data.post.tags.length}
				<ul class="mt-5 flex flex-wrap gap-2">
					{#each data.post.tags as tag (tag)}
						<li class="bg-accent-soft px-2.5 py-1 text-xs tracking-wide text-accent uppercase">
							{tag}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</Section>

	{#if data.post.cover_image_url}
		<div class="container-page">
			<!-- Same max-w-3xl as the body copy below, so the cover lines up with
			     the text instead of running the full 76rem container width. -->
			<div class="mx-auto max-w-3xl">
				<img
					src={data.post.cover_image_url}
					alt=""
					class="aspect-[16/9] w-full object-cover"
					fetchpriority="high"
				/>
			</div>
		</div>
	{/if}

	<Section tone="surface" space="md">
		<div class="mx-auto max-w-3xl">
			<!-- Sanitized server-side in lib/server/markdown.ts. -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="prose-lytebuy">{@html data.html}</div>
		</div>
	</Section>
</article>

{#if data.related.length}
	<Section tone="canvas" space="md">
		<Reveal>
			<Eyebrow>Keep reading</Eyebrow>
			<h2 class="text-title">More from the blog</h2>
		</Reveal>
		<div class="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
			{#each data.related as post, index (post.id)}
				<Reveal delay={index * 80}>
					<PostCard {post} />
				</Reveal>
			{/each}
		</div>
	</Section>
{/if}

<Section tone="iron" space="md">
	<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
		<h2 class="max-w-xl text-title">Want your shop on the map?</h2>
		<Button href="/sell" variant="onDark" size="lg">Start selling</Button>
	</div>
</Section>
