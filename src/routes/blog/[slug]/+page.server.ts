import { error } from '@sveltejs/kit';
import { getContentBySlug, listContent } from '$lib/server/blog';
import { renderMarkdown, toPlainText } from '$lib/server/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	const post = await getContentBySlug(fetch, 'post', params.slug);
	if (!post) {
		error(404, 'Post not found');
	}

	// Rendered server-side so the article ships as HTML in the first response
	// and no markdown parser reaches the client bundle.
	const html = renderMarkdown(post.body);
	const description = post.excerpt || toPlainText(post.body);

	const { items } = await listContent(fetch, 'post', { limit: 4 });
	const related = items.filter((item) => item.slug !== post.slug).slice(0, 3);

	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });

	return { post, html, description, related };
};
