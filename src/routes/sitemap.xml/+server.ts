import { env } from '$env/dynamic/public';
import { site } from '$lib/config';
import { listContent } from '$lib/server/blog';
import type { RequestHandler } from './$types';

/** Routes that always exist, with a rough priority ordering. */
const STATIC_ROUTES: Array<{ path: string; priority: string; changefreq: string }> = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/who-we-are', priority: '0.8', changefreq: 'monthly' },
	{ path: '/our-vision', priority: '0.6', changefreq: 'monthly' },
	// The lyte bearer (affiliate) pitch - a conversion page, so ranked with /sell.
	{ path: '/lyte-bearer', priority: '0.8', changefreq: 'monthly' },
	// The fork between the two paths; a primary nav entry, so ranked with them.
	{ path: '/promote-your-town', priority: '0.9', changefreq: 'monthly' },
	// The vendor conversion page; every "Start selling" CTA lands here.
	{ path: '/sell', priority: '0.9', changefreq: 'monthly' },
	{ path: '/get-the-app', priority: '0.8', changefreq: 'monthly' },
	{ path: '/get-involved', priority: '0.7', changefreq: 'monthly' },
	{ path: '/blog', priority: '0.7', changefreq: 'weekly' },
	{ path: '/press', priority: '0.5', changefreq: 'monthly' },
	{ path: '/investors', priority: '0.5', changefreq: 'monthly' }
];

/** XML has five reserved characters; a title with an ampersand breaks the feed. */
function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	const origin = (env.PUBLIC_SITE_URL || site.url).replace(/\/$/, '');

	// Both lists are public, so a failure degrades to a sitemap of static pages
	// rather than a 500 that would leave crawlers with nothing at all.
	const [posts, releases] = await Promise.all([
		listContent(fetch, 'post', { limit: 100 }),
		listContent(fetch, 'press_release', { limit: 100 })
	]);

	const urls = [
		...STATIC_ROUTES.map(({ path, priority, changefreq }) => ({
			loc: `${origin}${path === '/' ? '' : path}`,
			lastmod: undefined as string | undefined,
			priority,
			changefreq
		})),
		...posts.items.map((post) => ({
			loc: `${origin}/blog/${post.slug}`,
			lastmod: post.updated_date,
			priority: '0.6',
			changefreq: 'yearly'
		})),
		...releases.items.map((release) => ({
			loc: `${origin}/press/${release.slug}`,
			lastmod: release.updated_date,
			priority: '0.4',
			changefreq: 'yearly'
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		({ loc, lastmod, priority, changefreq }) => `	<url>
		<loc>${escapeXml(loc)}</loc>${lastmod ? `\n\t\t<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	setHeaders({
		'content-type': 'application/xml',
		'cache-control': 'public, max-age=0, s-maxage=3600'
	});

	return new Response(body);
};
