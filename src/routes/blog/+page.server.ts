import { listContent } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

const PER_PAGE = 12;

export const load: PageServerLoad = async ({ fetch, url, setHeaders }) => {
	// 1-based in the URL, 0-based offset on the wire. A junk ?page= falls back
	// to the first page rather than 400ing a public marketing route.
	const requested = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
	const current = Number.isFinite(requested) && requested > 0 ? requested : 1;

	const list = await listContent(fetch, 'post', {
		limit: PER_PAGE,
		offset: (current - 1) * PER_PAGE
	});

	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });

	return {
		posts: list.items,
		page: current,
		perPage: PER_PAGE,
		total: list.total,
		pageCount: Math.max(1, Math.ceil(list.total / PER_PAGE))
	};
};
