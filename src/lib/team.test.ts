// toParagraphs is what stands between a bio written as readable prose in
// team.ts and a wall of text on the page, so the blank-line handling is pinned
// here. The roster checks catch the two mistakes that break the page silently:
// a duplicate slug (two cards fighting over one #hash) and a photo path that
// does not resolve from /static.

import { describe, expect, it } from 'vitest';

import { findMember, team, toParagraphs } from './team';

describe('toParagraphs', () => {
	it('splits on a blank line', () => {
		expect(toParagraphs('First one.\n\nSecond one.')).toEqual(['First one.', 'Second one.']);
	});

	it('treats a run of blank lines as a single break', () => {
		expect(toParagraphs('First.\n\n\n\nSecond.')).toEqual(['First.', 'Second.']);
	});

	it('handles carriage returns from a pasted-in bio', () => {
		expect(toParagraphs('First.\r\n\r\nSecond.')).toEqual(['First.', 'Second.']);
	});

	it('collapses the indentation of a template literal into single spaces', () => {
		expect(toParagraphs('A sentence\n\t\tcontinued on the next line.')).toEqual([
			'A sentence continued on the next line.'
		]);
	});

	it('keeps a single paragraph as one entry', () => {
		expect(toParagraphs('Just the one.')).toEqual(['Just the one.']);
	});

	it('drops leading and trailing blank lines rather than emitting empties', () => {
		expect(toParagraphs('\n\nOnly this.\n\n')).toEqual(['Only this.']);
	});

	it('returns an empty array for a blank bio', () => {
		expect(toParagraphs('   \n\n  ')).toEqual([]);
	});
});

describe('findMember', () => {
	it('finds a member by slug', () => {
		expect(findMember('scott-dean')?.name).toBe('Scott Dean');
	});

	it('returns undefined for an unknown slug rather than throwing', () => {
		expect(findMember('nobody-here')).toBeUndefined();
	});
});

describe('team roster', () => {
	it('has at least one member', () => {
		expect(team.length).toBeGreaterThan(0);
	});

	it('gives every member a unique slug, so the #hash links stay distinct', () => {
		const slugs = team.map((member) => member.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('uses url-safe slugs', () => {
		for (const member of team) {
			expect(member.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
		}
	});

	it('points every photo at a file that exists in /static', () => {
		// Globbed rather than read off disk: it needs no node types, and Vite
		// resolves the paths the same way the built page will.
		const onDisk = new Set(
			Object.keys(import.meta.glob('/static/img/*', { eager: false })).map((path) =>
				path.replace('/static', '')
			)
		);

		for (const member of team) {
			expect(member.photo.startsWith('/')).toBe(true);
			expect(onDisk).toContain(member.photo);
		}
	});

	it('gives every photo alt text, since these are content images', () => {
		for (const member of team) {
			expect(member.photoAlt.trim().length).toBeGreaterThan(0);
		}
	});

	it('gives every member a bio that renders as at least one paragraph', () => {
		for (const member of team) {
			expect(toParagraphs(member.bio).length).toBeGreaterThan(0);
		}
	});
});
