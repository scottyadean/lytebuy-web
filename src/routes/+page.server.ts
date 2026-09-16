import { listContent } from '$lib/server/blog';
import { getFeedProducts } from '$lib/server/products';
import { getFeaturedVendor, getVendorCount } from '$lib/server/vendors';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	// Fetch the posts, the vendor count, the featured vendor and the product
	// feed together; none blocks the others, and all degrade to an empty state
	// on failure rather than throwing.
	const [{ items }, vendorCount, featuredVendor, products] = await Promise.all([
		listContent(fetch, 'post', { limit: 3 }),
		getVendorCount(fetch),
		getFeaturedVendor(fetch),
		getFeedProducts(fetch)
	]);

	// The landing page is otherwise static, so let a CDN hold it briefly while
	// still picking up a new post within the minute.
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });

	return { posts: items, vendorCount, featuredVendor, products };
};
