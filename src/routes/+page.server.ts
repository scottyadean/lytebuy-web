import { listContent } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const { items } = await listContent(fetch, 'post', { limit: 3 });

	// The landing page is otherwise static, so let a CDN hold it briefly while
	// still picking up a new post within the minute.
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });

	return { posts: items };
};
