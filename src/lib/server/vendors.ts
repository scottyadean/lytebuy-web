/** Client for the lytebuy backend (FastAPI).
 *
 *  Server-only, and it degrades rather than throws - a marketing page that shows
 *  no count is far better than one that 500s because the API is briefly down. So
 *  a transport failure or non-200 comes back as `null` and the route decides
 *  what to render.
 */

import { env } from '$env/dynamic/private';

function baseUrl(): string {
	// The FastAPI app mounts everything under /api/v1.
	return (env.LYTEBUY_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');
}

/** Total number of vendors (active + pending) from GET /vendors/vendor-count.
 *
 *  Returns `null` on any failure so the caller can hide the stat instead of
 *  showing a wrong or zero number.
 */
export async function getVendorCount(fetcher: typeof fetch): Promise<number | null> {
	const url = `${baseUrl()}/vendors/vendor-count`;

	try {
		const response = await fetcher(url);
		if (!response.ok) {
			console.error(`vendors: count responded ${response.status}`);
			return null;
		}
		const value = (await response.json()) as unknown;
		// The endpoint returns a bare integer.
		return typeof value === 'number' && Number.isFinite(value) ? value : null;
	} catch (cause) {
		console.error('vendors: count failed', cause);
		return null;
	}
}

/** The vendor shown in the landing page's Featured Vendor block. */
export type FeaturedVendor = {
	id: string;
	name: string;
	/** Storefront tagline, or the about text, or null when neither is set. */
	blurb: string | null;
	logoUrl: string | null;
	bannerUrl: string | null;
	/** Deep link into the app's public store page. */
	storeUrl: string;
};

/** Public origin of the buyer app, used to build the "visit the store" link. */
function appUrl(): string {
	return (env.LYTEBUY_APP_URL ?? 'http://localhost:3001').replace(/\/$/, '');
}

/** Absolute URL for a media path the API returned (it may already be absolute). */
function mediaUrl(path: string | null | undefined): string | null {
	if (!path) return null;
	return /^https?:\/\//i.test(path) ? path : `${baseUrl().replace(/\/api\/v1$/, '')}/${path.replace(/^\//, '')}`;
}

/** The currently featured vendor from GET /vendors/featured.
 *
 *  Returns `null` when there is no featured vendor (the endpoint 404s when no
 *  vendor is active yet) or on any failure, so the caller can simply omit the
 *  section - the ticket asks for it "if available".
 */
export async function getFeaturedVendor(fetcher: typeof fetch): Promise<FeaturedVendor | null> {
	const url = `${baseUrl()}/vendors/featured`;

	try {
		const response = await fetcher(url);
		// 404 is the normal "no active vendors yet" case, not an error worth logging.
		if (response.status === 404) return null;
		if (!response.ok) {
			console.error(`vendors: featured responded ${response.status}`);
			return null;
		}

		const data = (await response.json()) as {
			id?: unknown;
			business_name?: unknown;
			description?: unknown;
			storefront?: {
				tagline?: unknown;
				about?: unknown;
				logo_url?: unknown;
				banner_url?: unknown;
			} | null;
		};

		// Without an id and a name there is nothing worth rendering.
		if (typeof data.id !== 'string' || typeof data.business_name !== 'string') return null;

		const str = (value: unknown): string | null =>
			typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

		const sf = data.storefront ?? null;
		return {
			id: data.id,
			name: data.business_name,
			blurb: str(sf?.tagline) ?? str(sf?.about) ?? str(data.description),
			logoUrl: mediaUrl(str(sf?.logo_url)),
			bannerUrl: mediaUrl(str(sf?.banner_url)),
			storeUrl: `${appUrl()}/store/${data.id}`
		};
	} catch (cause) {
		console.error('vendors: featured failed', cause);
		return null;
	}
}

/** One vendor in the public directory grid.
 *
 *  Mirrors VendorDirectoryRow from the backend (LB-8.7) - deliberately leaner
 *  than the storefront payload, because a grid of cards does not need follower
 *  counts or live locations and fetching them costs three extra queries a row.
 */
export type DirectoryVendor = {
	name: string;
	trade: string | null;
	town: string | null;
	image: string | null;
	slug: string;
	storeUrl: string;
};

/** How many cards the directory grid shows. The grid is 3 columns at lg, so 24
 *  fills exactly eight rows and matches the API's own default. */
export const DIRECTORY_LIMIT = 24;

/** Turn a business_type enum into the card's second line.
 *
 *  A named helper because the raw value is a snake_case enum ("food_truck") and
 *  printing it unchanged on a marketing page looks like leaked database
 *  internals. One place, so every surface spells it the same way.
 */
export function tradeLabel(businessType: unknown): string | null {
	if (typeof businessType !== 'string' || !businessType) return null;
	const words = businessType.replace(/_/g, ' ').trim();
	return words ? words.charAt(0).toUpperCase() + words.slice(1) : null;
}

/** Active vendors for the home page directory.
 *
 *  Returns [] when nobody has signed up yet OR the API is unreachable - the
 *  caller renders the same "be first on the map" state for both, because to a
 *  visitor they are the same thing.
 */
export async function getDirectoryVendors(fetcher: typeof fetch): Promise<DirectoryVendor[]> {
	const url = `${baseUrl()}/vendors/directory?limit=${DIRECTORY_LIMIT}`;

	try {
		const response = await fetcher(url);
		if (!response.ok) {
			console.error(`vendors: directory responded ${response.status}`);
			return [];
		}
		const body = (await response.json()) as unknown;
		const items = (body as { items?: unknown })?.items;
		if (!Array.isArray(items)) return [];

		return items
			.map((raw): DirectoryVendor | null => {
				if (!raw || typeof raw !== 'object') return null;
				const row = raw as Record<string, unknown>;
				const name = typeof row.business_name === 'string' ? row.business_name : '';
				const slug = typeof row.slug === 'string' ? row.slug : '';
				// Without a name there is no card, and without a slug the card
				// cannot link anywhere - drop rather than render a dead tile.
				if (!name || !slug) return null;

				return {
					name,
					// The vendor's own tagline beats a generic business type when
					// they have written one.
					trade:
						(typeof row.tagline === 'string' && row.tagline) || tradeLabel(row.business_type),
					town: typeof row.town === 'string' && row.town ? row.town : null,
					image: typeof row.logo_url === 'string' && row.logo_url ? row.logo_url : null,
					slug,
					storeUrl: `${appUrl()}/store/${slug}`
				};
			})
			.filter((v): v is DirectoryVendor => v !== null);
	} catch (cause) {
		console.error('vendors: directory failed', cause);
		return [];
	}
}
