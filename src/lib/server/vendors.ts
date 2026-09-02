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
