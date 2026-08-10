import { listContent } from '$lib/server/blog';
import { getVendorCount } from '$lib/server/vendors';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	// Fetch the posts and the vendor count together; neither blocks the other,
	// and both degrade to an empty state on failure rather than throwing.
	const [{ items }, vendorCount] = await Promise.all([
		listContent(fetch, 'post', { limit: 3 }),
		getVendorCount(fetch)
	]);

	// The landing page is otherwise static, so let a CDN hold it briefly while
	// still picking up a new post within the minute.
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });

	return { posts: items, vendorCount };
};
