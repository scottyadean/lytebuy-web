import { json, error } from '@sveltejs/kit';
import { bumpViews, type ContentType } from '$lib/server/blog';
import type { RequestHandler } from './$types';

/** The content types the browser may bump, so a caller can't POST an arbitrary
 *  path segment through to the blog service. */
const ALLOWED_TYPES: ContentType[] = ['post', 'press_release'];

/** Proxy the view-count bump so the browser never sees the blog service's URL or
 *  key. A post page fires POST /api/views { id, type } after it renders; this
 *  forwards to the blog service and returns the new count.
 *
 *  A missed view is not worth a hard failure, so an unreachable blog service or
 *  a bad id comes back as `{ views: null }` with a 200 rather than an error the
 *  client would have to handle - only a malformed request body is rejected.
 */
export const POST: RequestHandler = async ({ request, fetch }) => {
	let payload: { id?: unknown; type?: unknown };
	try {
		payload = await request.json();
	} catch {
		error(400, 'invalid json body');
	}

	const { id, type } = payload;
	if (typeof id !== 'string' || !id) {
		error(400, 'id is required');
	}
	if (typeof type !== 'string' || !ALLOWED_TYPES.includes(type as ContentType)) {
		error(400, 'type must be one of: ' + ALLOWED_TYPES.join(', '));
	}

	const views = await bumpViews(fetch, type as ContentType, id);
	return json({ views });
};
