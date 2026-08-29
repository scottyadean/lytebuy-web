/** Client for lytebuy-blog-service.
 *
 *  Server-only: the single-item endpoints are API-key guarded and the key must
 *  never reach the browser, so every call happens during SSR. That is also why
 *  the blog pages are not prerendered.
 *
 *  Every function degrades rather than throws. A marketing site whose blog
 *  index 500s because a Lambda is cold is worse than one that renders the page
 *  with an empty state, so transport failures come back as `null`/`[]` and the
 *  route decides what to show. A genuine 404 is different and is surfaced.
 */

import { env } from '$env/dynamic/private';

export type ContentType = 'post' | 'press_release';

export interface PostSummary {
	id: string;
	content_type: ContentType;
	title: string;
	slug: string;
	excerpt: string | null;
	cover_image_url: string | null;
	author: string;
	tags: string[];
	views: number;
	created_date: string;
	updated_date: string;
}

export interface Post extends PostSummary {
	body: string;
}

export interface PostList {
	items: PostSummary[];
	count: number;
	total: number;
	limit: number;
	offset: number;
}

const EMPTY: PostList = { items: [], count: 0, total: 0, limit: 0, offset: 0 };

/** Path segment on the blog service for each content type. */
const PATHS: Record<ContentType, string> = {
	post: 'posts',
	press_release: 'press-releases'
};

function baseUrl(): string {
	// e.g. http://localhost:5600/local when running `sls offline`
	return (env.BLOG_API_URL ?? 'http://localhost:5600/local').replace(/\/$/, '');
}

function headers(): Record<string, string> {
	const key = env.BLOG_API_KEY;
	// Locally `sls offline --noAuth` accepts requests without a key, so a
	// missing key is not fatal in development. In a deployed stage API Gateway
	// rejects the call and the page falls back to its empty state.
	return key ? { 'x-api-key': key } : {};
}

/** Public list endpoint. No API key required. */
export async function listContent(
	fetcher: typeof fetch,
	type: ContentType,
	{ limit = 12, offset = 0 } = {}
): Promise<PostList> {
	const url = `${baseUrl()}/${PATHS[type]}?limit=${limit}&offset=${offset}`;

	try {
		const response = await fetcher(url);
		if (!response.ok) {
			console.error(`blog: list ${type} responded ${response.status}`);
			return { ...EMPTY, limit };
		}
		return (await response.json()) as PostList;
	} catch (cause) {
		console.error(`blog: list ${type} failed`, cause);
		return { ...EMPTY, limit };
	}
}

/** Resolve a slug to an item, then fetch it in full.
 *
 *  The blog service addresses single items by id, but ids make ugly, unstable
 *  URLs and the brief calls for SEO, so the site routes on slug and resolves it
 *  here through the public list endpoint.
 *
 *  Caveat: this only sees the newest 100 items, which is the service's own list
 *  cap. That is fine for a launch blog, but once the archive is bigger than that
 *  the service needs a real GET /posts/slug/{slug} and this should call it.
 */
export async function getContentBySlug(
	fetcher: typeof fetch,
	type: ContentType,
	slug: string
): Promise<Post | null> {
	const { items } = await listContent(fetcher, type, { limit: 100 });
	const match = items.find((item) => item.slug === slug);
	if (!match) return null;
	return getContent(fetcher, type, match.id);
}

/** Single item.
 *
 *  A read no longer increments the view counter: the blog service moved counting
 *  to a separate endpoint (see bumpViews) that the browser calls after the page
 *  renders. Reads are public now, but the key is still sent when present - it is
 *  harmless and keeps working if a stage ever re-guards the route.
 */
export async function getContent(
	fetcher: typeof fetch,
	type: ContentType,
	id: string
): Promise<Post | null> {
	const url = `${baseUrl()}/${PATHS[type]}/${encodeURIComponent(id)}`;

	try {
		const response = await fetcher(url, { headers: headers() });
		if (!response.ok) {
			if (response.status !== 404) {
				console.error(`blog: get ${type} responded ${response.status}`);
			}
			return null;
		}
		return (await response.json()) as Post;
	} catch (cause) {
		console.error(`blog: get ${type} failed`, cause);
		return null;
	}
}

/** Bump a post's view counter, returning the new count (or null on failure).
 *
 *  Public, no key. The browser cannot call the blog service directly because its
 *  base URL is a server-only secret, so a page fires this through the site's own
 *  /api/views route (see routes/api/views/+server.ts) and the request lands here
 *  during SSR of that endpoint. Failures degrade to null: a missed view count is
 *  never worth failing a request over.
 */
export async function bumpViews(
	fetcher: typeof fetch,
	type: ContentType,
	id: string
): Promise<number | null> {
	const url = `${baseUrl()}/${PATHS[type]}/${encodeURIComponent(id)}/views`;

	try {
		const response = await fetcher(url, { method: 'POST' });
		if (!response.ok) {
			console.error(`blog: bump ${type} views responded ${response.status}`);
			return null;
		}
		const data = (await response.json()) as { views: number };
		return data.views;
	} catch (cause) {
		console.error(`blog: bump ${type} views failed`, cause);
		return null;
	}
}
