/** Server-side markdown rendering for blog and press bodies.
 *
 *  Rendered here rather than in the browser so the article ships as HTML in the
 *  first response: crawlers see the full text, and there is no markdown parser
 *  in the client bundle.
 *
 *  Bodies come from an API-key guarded endpoint, so the author is trusted, but
 *  the output is sanitized anyway. Trusted-by-policy is not the same as safe,
 *  and one compromised key should not turn every article into a script host.
 */

import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
	'h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'blockquote',
	'strong', 'em', 'code', 'pre', 'img', 'hr', 'br', 'figure', 'figcaption',
	'table', 'thead', 'tbody', 'tr', 'th', 'td'
];

export function renderMarkdown(markdown: string): string {
	// `async: false` keeps this synchronous; marked's types otherwise widen the
	// return to string | Promise<string>.
	const html = marked.parse(markdown, { async: false, gfm: true, breaks: false });

	return sanitizeHtml(html, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: {
			a: ['href', 'title'],
			img: ['src', 'alt', 'title', 'loading', 'width', 'height']
		},
		// Anything not on this list (javascript:, data:) is dropped entirely.
		allowedSchemes: ['http', 'https', 'mailto'],
		transformTags: {
			// Article images are always below the fold.
			img: (tagName, attribs) => ({
				tagName,
				attribs: { ...attribs, loading: 'lazy', decoding: 'async' }
			}),
			// An outbound link from an article should not hand the destination a
			// window.opener handle, and should not pass our ranking along.
			a: (tagName, attribs) => {
				const href = attribs.href ?? '';
				const external = /^https?:\/\//i.test(href);
				return {
					tagName,
					attribs: external
						? { ...attribs, target: '_blank', rel: 'noopener noreferrer nofollow' }
						: attribs
				};
			}
		}
	});
}

/** Plain text of a body, for meta descriptions when a post has no excerpt. */
export function toPlainText(markdown: string, limit = 180): string {
	const text = sanitizeHtml(marked.parse(markdown, { async: false }), {
		allowedTags: [],
		allowedAttributes: {}
	})
		.replace(/\s+/g, ' ')
		.trim();

	if (text.length <= limit) return text;
	// Cut on a word boundary so the description does not end mid-word.
	return `${text.slice(0, text.lastIndexOf(' ', limit))}…`;
}
