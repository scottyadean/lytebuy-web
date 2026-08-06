<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact, site } from '$lib/config';
	import { formatDate, isoDate } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const origin = $derived((env.PUBLIC_SITE_URL || site.url).replace(/\/$/, ''));
</script>

<Seo
	title={data.release.title}
	description={data.description}
	image={data.release.cover_image_url ?? undefined}
	type="article"
	publishedAt={isoDate(data.release.created_date)}
	modifiedAt={isoDate(data.release.updated_date)}
	author={data.release.author}
	schema={{
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: data.release.title,
		description: data.description,
		datePublished: isoDate(data.release.created_date),
		dateModified: isoDate(data.release.updated_date),
		author: { '@type': 'Organization', name: data.release.author },
		publisher: { '@type': 'Organization', name: site.name },
		mainEntityOfPage: `${origin}/press/${data.release.slug}`
	}}
/>

<article>
	<Section tone="surface" space="md">
		<div class="mx-auto max-w-3xl">
			<a href="/press" class="text-sm text-accent hover:text-iron">
				<span aria-hidden="true">&larr;</span> All press releases
			</a>

			<p class="mt-8 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
				For immediate release
			</p>
			<h1 class="mt-3 text-display leading-[1.05]">{data.release.title}</h1>

			<p class="mt-6 text-sm text-granite">
				<time datetime={isoDate(data.release.created_date)}>
					{formatDate(data.release.created_date)}
				</time>
				<span aria-hidden="true">·</span>
				{data.release.author}
			</p>
		</div>
	</Section>

	<Section tone="surface" space="md">
		<div class="mx-auto max-w-3xl">
			<!-- Sanitized server-side in lib/server/markdown.ts. -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="prose-lytebuy">{@html data.html}</div>

			<div class="mt-16 border-t border-dust pt-8">
				<h2 class="text-lg">Media contact</h2>
				<p class="mt-2 leading-relaxed">
					<a
						href="mailto:{contact.pressEmail}"
						class="text-accent underline underline-offset-4"
					>
						{contact.pressEmail}
					</a>
					<br />
					{site.name}, {contact.town}
				</p>
			</div>
		</div>
	</Section>
</article>
