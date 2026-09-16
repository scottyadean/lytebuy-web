/** Product feed for the landing page's "What is good today" section.
 *
 *  Server-only, and it degrades rather than throws - same contract as
 *  vendors.ts: a transport failure or non-200 comes back as an empty list and
 *  the route decides what to render.
 *
 *  This replaced four hardcoded fake listings (Estrela Bakery, Cedar & Pine,
 *  Hangtown Records, Apple Pantry Farm) with invented prices. Those read as real
 *  inventory to a visitor, which is a promise the site could not keep - and they
 *  would have needed someone to remember to delete them on the day the first
 *  real vendor listed. Reading the API means the section fills itself in.
 */

// $env/STATIC/private, not dynamic. Amplify's SSR compute tier gets NO runtime
// environment - console env vars reach the build container only - so a dynamic
// read returns undefined in production and every baseUrl() below silently falls
// back to its localhost default. static/ inlines the values at build time from
// the .env.production that amplify.yml writes, which is the only seam that
// survives the trip to compute.
import * as env from '$env/static/private';

/** What ProductCard needs. Deliberately the card's shape, not the API's, so the
 *  backend's field names do not leak into the markup. */
export type FeedProduct = {
	name: string;
	vendor: string;
	price: string;
	deal?: string;
	image?: string;
};

/** How many cards the feed row shows. The grid is 2 columns on phones and 4 on
 *  desktop, so 4 fills exactly one row at every breakpoint. */
export const FEED_LIMIT = 4;

function baseUrl(): string {
	// The FastAPI app mounts everything under /api/v1.
	return (env.LYTEBUY_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');
}

/** Absolute URL for a media path the API returned (it may already be absolute). */
function mediaUrl(path: unknown): string | undefined {
	if (typeof path !== 'string' || !path) return undefined;
	if (/^https?:\/\//i.test(path)) return path;
	const origin = baseUrl().replace(/\/api\/v1$/, '');
	return `${origin}/${path.replace(/^\//, '')}`;
}

/** Money for display.
 *
 *  A named helper because the same rule applies to every price on the page and
 *  the API returns minor units (cents) - formatting inline at each call site is
 *  how "$7" and "$700" end up on the same screen for the same product.
 */
export function formatPrice(cents: unknown): string | null {
	if (typeof cents !== 'number' || !Number.isFinite(cents)) return null;
	const dollars = cents / 100;
	// Whole dollars lose the ".00" - "$7" reads better on a card than "$7.00",
	// and it matches how the sample copy was written.
	return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

/** One API item -> one card, or null when it is not renderable.
 *
 *  Returning null rather than a card with blanks keeps a half-populated product
 *  from rendering as an empty box next to real ones.
 */
function toFeedProduct(raw: unknown): FeedProduct | null {
	if (!raw || typeof raw !== 'object') return null;
	const item = raw as Record<string, unknown>;

	const name = typeof item.title === 'string' ? item.title : item.name;
	const price = formatPrice(item.price_cents ?? item.price);
	if (typeof name !== 'string' || !name || !price) return null;

	// The vendor may arrive nested or flattened depending on the endpoint.
	const vendorObject = (item.vendor ?? item.store_front) as Record<string, unknown> | undefined;
	const vendor =
		(typeof vendorObject?.name === 'string' && vendorObject.name) ||
		(typeof item.vendor_name === 'string' && item.vendor_name) ||
		'';
	if (!vendor) return null;

	const images = Array.isArray(item.images) ? item.images : [];
	const first = images[0] as Record<string, unknown> | string | undefined;
	const image = mediaUrl(typeof first === 'string' ? first : first?.url ?? item.image_url);

	return { name, vendor, price, ...(image ? { image } : {}) };
}

/** The newest listings for the landing page feed.
 *
 *  Returns [] when there is nothing to show OR the API is unreachable - the
 *  caller renders the same "no listings yet" state for both, because to a
 *  visitor they are the same thing and an error message would be noise.
 */
export async function getFeedProducts(fetcher: typeof fetch): Promise<FeedProduct[]> {
	const url = `${baseUrl()}/products?limit=${FEED_LIMIT}`;

	try {
		const response = await fetcher(url);
		if (!response.ok) {
			console.error(`products: feed responded ${response.status}`);
			return [];
		}
		const body = (await response.json()) as unknown;
		const items = (body as { items?: unknown })?.items;
		if (!Array.isArray(items)) return [];

		return items.map(toFeedProduct).filter((p): p is FeedProduct => p !== null);
	} catch (cause) {
		console.error('products: feed failed', cause);
		return [];
	}
}
