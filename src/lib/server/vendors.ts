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
