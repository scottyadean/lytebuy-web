import { error } from '@sveltejs/kit';
import { getContentBySlug } from '$lib/server/blog';
import { renderMarkdown, toPlainText } from '$lib/server/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	const release = await getContentBySlug(fetch, 'press_release', params.slug);
	if (!release) {
		error(404, 'Press release not found');
	}

	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });

	return {
		release,
		html: renderMarkdown(release.body),
		description: release.excerpt || toPlainText(release.body)
	};
};
