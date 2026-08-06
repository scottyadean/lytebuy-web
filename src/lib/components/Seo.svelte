<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { site } from '$lib/config';

	interface Props {
		title: string;
		description?: string;
		/** Absolute or root-relative; resolved against the site origin. */
		image?: string;
		type?: 'website' | 'article';
		publishedAt?: string;
		modifiedAt?: string;
		author?: string;
		/** Keeps thin or duplicated pages out of the index. */
		noindex?: boolean;
		/** Extra JSON-LD merged after the default graph. */
		schema?: Record<string, unknown>;
	}

	let {
		title,
		description = site.description,
		image = '/img/placerville-hero-poster.jpg',
		type = 'website',
		publishedAt,
		modifiedAt,
		author,
		noindex = false,
		schema
	}: Props = $props();

	// PUBLIC_SITE_URL lets the same build serve a preview domain with correct
	// canonicals; without it the configured production origin is used.
	const origin = $derived((env.PUBLIC_SITE_URL || site.url).replace(/\/$/, ''));
	const canonical = $derived(`${origin}${page.url.pathname === '/' ? '' : page.url.pathname}`);
	const absoluteImage = $derived(image.startsWith('http') ? image : `${origin}${image}`);
	// The home page title is the brand alone; everything else is suffixed.
	const fullTitle = $derived(
		page.url.pathname === '/' ? `${site.name} — ${site.tagline}` : `${title} — ${site.name}`
	);

	const jsonLd = $derived(
		JSON.stringify(
			schema ?? {
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: site.name,
				url: origin,
				logo: `${origin}/lytebuy-logo.svg`,
				description: site.description,
				slogan: site.tagline
			}
		)
			// The graph embeds article titles and descriptions, so a body carrying a
			// closing script tag would otherwise break out of the block and run as
			// markup. Escaping < and the line separators is the standard
			// JSON-embedded-in-HTML fix.
			.replace(/</g, '\\u003c')
			.replace(/\u2028/g, '\\u2028')
			.replace(/\u2029/g, '\\u2029')
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}

	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:locale" content={site.locale} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={site.twitter} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absoluteImage} />

	{#if type === 'article'}
		{#if publishedAt}<meta property="article:published_time" content={publishedAt} />{/if}
		{#if modifiedAt}<meta property="article:modified_time" content={modifiedAt} />{/if}
		{#if author}<meta property="article:author" content={author} />{/if}
	{/if}

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON.stringify output, not user markup -->
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
