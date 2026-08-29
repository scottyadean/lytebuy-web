/** Browser-side view-count helper.
 *
 *  Not under $lib/server: this runs in the browser. It POSTs to the site's own
 *  /api/views proxy (which forwards to the blog service) so a post page can
 *  record a view after it renders. Returns the new count, or null if the bump
 *  failed - a missed view is never worth surfacing an error to the reader.
 */
import type { ContentType } from '$lib/server/blog';

export async function recordView(type: ContentType, id: string): Promise<number | null> {
	try {
		const response = await fetch('/api/views', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ id, type })
		});
		if (!response.ok) return null;
		const data = (await response.json()) as { views: number | null };
		return data.views;
	} catch {
		return null;
	}
}
