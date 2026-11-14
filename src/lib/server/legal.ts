/** Loads the binding legal documents from docs/legal/ in the monorepo.
 *
 *  Both app stores require a PUBLIC privacy policy URL, so the same documents
 *  the app shows have to be reachable on the web. The wording lives in exactly
 *  one place - the markdown under docs/legal/ - and is read from there at build
 *  time. Copying the text into Svelte would make a third copy (markdown, the
 *  client's typed content modules, and the web page), and the next legal edit
 *  would have to be made three times.
 *
 *  Read at module scope so it happens once per server start rather than per
 *  request, and so a missing or renamed document fails the build instead of
 *  serving an empty policy page.
 */

// Imported with Vite's ?raw rather than read with node:fs: it needs no
// @types/node, it resolves the path at build time instead of guessing at a
// location relative to the compiled output, and it makes the markdown a tracked
// build input - editing a document rebuilds the page.
import privacyMarkdown from '../../../../docs/legal/privacy-policy.md?raw';
import taxMarkdown from '../../../../docs/legal/tax-responsibility.md?raw';
import termsMarkdown from '../../../../docs/legal/terms-of-use.md?raw';

import { renderMarkdown } from './markdown';

export type LegalSlug = 'privacy' | 'terms' | 'tax';

type LegalMeta = {
	/** The document's markdown, imported above. */
	markdown: string;
	/** <h1> and <title>. The markdown's own h1 is dropped - see stripEditorialHeader. */
	title: string;
	description: string;
};

const DOCUMENTS: Record<LegalSlug, LegalMeta> = {
	privacy: {
		markdown: privacyMarkdown,
		title: 'Privacy Policy',
		description: 'How Lytebuy collects, uses and shares information in the marketplace app.'
	},
	terms: {
		markdown: termsMarkdown,
		title: 'Terms of Use',
		description: 'The terms governing use of the Lytebuy marketplace.'
	},
	tax: {
		markdown: taxMarkdown,
		title: 'Tax Responsibility',
		description: 'How sales tax works on Lytebuy and what vendors are responsible for.'
	}
};

/**
 * Removes the markdown h1 and the editorial DRAFT blockquote.
 *
 * The h1 becomes the page's own heading, so leaving it in the body would print
 * the title twice. The blockquote is a note to whoever is maintaining the
 * document ("fill the bracketed placeholders", "must be reviewed by an
 * attorney") - instructions for an editor, not terms for a reader, and it would
 * undermine the document to publish it.
 */
function stripEditorialHeader(markdown: string): string {
	const lines = markdown.split('\n');
	const body: string[] = [];
	let seenHeading = false;

	for (const line of lines) {
		if (!seenHeading && line.startsWith('# ')) {
			seenHeading = true;
			continue;
		}
		// The draft note is the blockquote directly under the h1; a blockquote
		// later in the document is real content and is kept.
		if (seenHeading && body.length === 0 && (line.startsWith('>') || line.trim() === '')) {
			if (line.startsWith('>')) continue;
			if (body.length === 0) continue;
		}
		if (seenHeading) body.push(line);
	}

	return body.join('\n').trim();
}

/**
 * Drops the trailing engineering footnote.
 *
 * Every document ends with a horizontal rule and an italic maintainer note
 * naming source files, model fields and config flags ("app/services/fees.py",
 * "TAX_ENGINE_ENABLED", "app/models/user.py"). That is a note to whoever keeps
 * the document accurate, not part of the agreement, and publishing a map of the
 * codebase on a public page serves nobody.
 *
 * Only the LAST rule-plus-italic block is removed, so a horizontal rule used
 * inside the document stays.
 */
function stripEngineeringFootnote(markdown: string): string {
	const lastRule = markdown.lastIndexOf('\n---\n');
	if (lastRule === -1) return markdown;

	const tail = markdown.slice(lastRule + 5).trim();
	// The footnote is wholly italic. Anything else after a rule is real content.
	if (tail.startsWith('*') && tail.endsWith('*')) {
		return markdown.slice(0, lastRule).trim();
	}
	return markdown;
}

/**
 * Drops inline engineering asides.
 *
 * Besides the trailing footnote, the documents carry parenthetical notes aimed
 * at whoever maintains them, which cite repo paths ("See docs/TAX.md"). One of
 * them states in public that the rate table "does not yet add county/city
 * rates, which can slightly under-collect in some ZIP codes" - a candid note
 * for the team, and not something to publish beside a tax policy.
 *
 * Only an aside that cites a repo path is removed; ordinary parentheses stay.
 */
function stripEngineeringAsides(markdown: string): string {
	// An italic parenthetical, possibly spanning lines, naming a docs/ or app/ path.
	return markdown.replace(/\*\([^)]*(?:docs\/|app\/)[^)]*\)\*/g, '').replace(/[ \t]+\n/g, '\n');
}

/** Where each document's markdown filename lives on this site. */
const ROUTE_FOR_FILE: Record<string, string> = {
	'privacy-policy.md': '/privacy',
	'terms-of-use.md': '/terms',
	'tax-responsibility.md': '/tax'
};

/**
 * Rewrites the documents' cross-links to web routes.
 *
 * The documents link to each other by filename ("[Tax Responsibility]
 * (tax-responsibility.md)"), which is right in the repo and on GitHub but a 404
 * on the site. Rewritten here rather than in the markdown so the source stays
 * correct in the place it is actually maintained.
 */
function rewriteCrossLinks(markdown: string): string {
	return Object.entries(ROUTE_FOR_FILE).reduce(
		(text, [file, route]) => text.replaceAll(`(${file})`, `(${route})`),
		markdown
	);
}

export type LegalDocument = {
	title: string;
	description: string;
	html: string;
};

export function loadLegalDocument(slug: LegalSlug): LegalDocument {
	const meta = DOCUMENTS[slug];

	return {
		title: meta.title,
		description: meta.description,
		// Order matters: the header and footnote come off first, then the inline
		// asides, then cross-links are pointed at web routes.
		html: renderMarkdown(
			rewriteCrossLinks(
				stripEngineeringAsides(stripEngineeringFootnote(stripEditorialHeader(meta.markdown)))
			)
		)
	};
}
