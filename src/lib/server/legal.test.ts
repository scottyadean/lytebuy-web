/** These pages are the URL the app stores are given for the privacy policy, so
 *  a silently empty or placeholder-bearing page is a store-review problem, not
 *  a cosmetic one. These tests read the real documents from docs/legal/.
 */

import { describe, expect, it } from 'vitest';

import { loadLegalDocument, type LegalSlug } from './legal';

const SLUGS: LegalSlug[] = ['privacy', 'terms', 'tax'];

describe('loadLegalDocument', () => {
	it.each(SLUGS)('%s renders real content', (slug) => {
		const doc = loadLegalDocument(slug);
		expect(doc.html.length).toBeGreaterThan(500);
		expect(doc.title).toBeTruthy();
	});

	it.each(SLUGS)('%s drops the editorial draft note', (slug) => {
		// "not legal advice" is the opening of the maintainer blockquote. Publishing
		// it would undermine the document it introduces.
		expect(loadLegalDocument(slug).html).not.toContain('not legal advice');
	});

	it.each(SLUGS)('%s does not print its title twice', (slug) => {
		// The h1 comes from the Svelte page; the markdown's own h1 is stripped.
		expect(loadLegalDocument(slug).html).not.toContain('<h1');
	});

	it('privacy names the operating entity', () => {
		expect(loadLegalDocument('privacy').html).toContain('Scott Dean');
	});

	it('privacy carries the contact address', () => {
		const html = loadLegalDocument('privacy').html;
		expect(html).toContain('info@lytebuy.com');
		expect(html).toContain('Gilbert, AZ 85234');
	});

	it('terms names the governing jurisdiction', () => {
		expect(loadLegalDocument('terms').html).toContain('Arizona');
	});

	it.each(SLUGS)('%s links to sibling documents by route, not by filename', (slug) => {
		// The markdown cross-links as "(tax-responsibility.md)", which is correct in
		// the repo and a 404 on the site. The prerenderer catches this, so a
		// regression here fails the build - this test just names the reason.
		const html = loadLegalDocument(slug).html;
		expect(html).not.toContain('.md"');
		expect(html).not.toContain('.md#');
	});

	it('rewrites a known cross-link to its route', () => {
		// terms-of-use.md line 89 links to the privacy policy.
		expect(loadLegalDocument('terms').html).toContain('href="/privacy"');
	});

	it.each(SLUGS)('%s does not publish the engineering footnote', (slug) => {
		// Each document ends with a maintainer note naming source files and config
		// flags. That is a map of the codebase, not part of the agreement.
		const html = loadLegalDocument(slug).html;
		expect(html).not.toContain('app/services');
		expect(html).not.toContain('app/models');
		expect(html).not.toContain('docs/TAX.md');
		expect(html).not.toContain('TAX_ENGINE_ENABLED');
	});

	it('does not publish the tax under-collection note', () => {
		// The source document candidly records that state-level rates "can slightly
		// under-collect in some ZIP codes". True, useful to the team, and not
		// something to state in public next to a tax policy.
		expect(loadLegalDocument('tax').html).not.toContain('under-collect');
	});

	it('keeps the tax document substance the aside was attached to', () => {
		// Stripping the aside must not take the clause it annotated.
		const html = loadLegalDocument('tax').html;
		expect(html).toContain("buyer's location");
		expect(html).toContain('No-sales-tax states');
	});

	it.each(SLUGS)('%s still ends with real document content', (slug) => {
		// Guards the footnote strip against eating the document's own closing
		// section - the regex is deliberately narrow, and this proves it.
		expect(loadLegalDocument(slug).html.length).toBeGreaterThan(2000);
	});

	// The three remaining placeholders are legal/CPA decisions, not code. They are
	// listed here so that filling one makes this test fail and prompt its removal,
	// rather than shipping quietly.
	const UNRESOLVED = ['[Dispute-resolution clause', '[the greater of the amount', '[List the currently-registered'];

	it('has exactly the three known unresolved clauses, and no other placeholder', () => {
		const all = SLUGS.map((s) => loadLegalDocument(s).html).join('\n');

		// These must be filled by a lawyer/CPA before launch.
		for (const known of UNRESOLVED) {
			expect(all).toContain(known);
		}

		// Nothing else bracketed should survive. This catches a newly introduced
		// placeholder, or one of the six we filled regressing.
		const brackets = all.match(/\[[A-Za-z][^\]]{3,60}\]/g) ?? [];
		const unexpected = brackets.filter((b) => !UNRESOLVED.some((k) => b.startsWith(k)));
		expect(unexpected).toEqual([]);
	});
});
