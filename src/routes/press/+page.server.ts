import { listContent } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	// Press releases are few; one page of 50 covers the archive without paging.
	const list = await listContent(fetch, 'press_release', { limit: 50 });

	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });

	return { releases: list.items, total: list.total };
};
