// The state list is the substance of the registration section, and a founder
// acts on what it says. These guard the shape of the data itself (every state
// present, no duplicates, no half-filled filing block) as well as the lookups,
// so a bad hand-edit fails here rather than on the page.

import { describe, expect, it } from 'vitest';

import {
	STATES,
	coverageLabel,
	detailedStates,
	findStateByCode,
	genericStates,
	hasDetailedGuidance,
	searchStates,
	type StateInfo
} from './business-registration';

/** A small fixture, so the lookup tests do not depend on the seeded states. */
const fixture: StateInfo[] = [
	{ code: 'AL', name: 'Alabama' },
	{
		code: 'CA',
		name: 'California',
		llcFiling: {
			agency: 'California Secretary of State',
			fileUrl: 'https://example.test/file',
			nameSearchUrl: 'https://example.test/search'
		},
		sellerPermit: {
			agency: 'CDTFA',
			registerUrl: 'https://example.test/permit',
			name: "seller's permit"
		}
	},
	{ code: 'MA', name: 'Massachusetts' }
];

describe('STATES data', () => {
	it('covers all 50 states plus DC', () => {
		expect(STATES).toHaveLength(51);
	});

	it('has no duplicate codes', () => {
		const codes = STATES.map((state) => state.code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it('uses two-letter uppercase USPS codes', () => {
		for (const state of STATES) {
			expect(state.code).toMatch(/^[A-Z]{2}$/);
		}
	});

	it('is ordered alphabetically by name, so the page needs no sort', () => {
		const names = STATES.map((state) => state.name);
		expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
	});

	it('gives every detailed state a seller permit - the piece that applies to everyone', () => {
		for (const state of detailedStates()) {
			expect(state.sellerPermit?.agency, state.name).toBeTruthy();
			expect(state.sellerPermit?.registerUrl, state.name).toMatch(/^https:\/\//);
			expect(state.sellerPermit?.name, state.name).toBeTruthy();
		}
	});

	it('gives every LLC filing block an agency and both links', () => {
		for (const state of STATES.filter((s) => s.llcFiling)) {
			expect(state.llcFiling?.agency, state.name).toBeTruthy();
			expect(state.llcFiling?.fileUrl, state.name).toMatch(/^https:\/\//);
			expect(state.llcFiling?.nameSearchUrl, state.name).toMatch(/^https:\/\//);
		}
	});

	it('uses https for every link it publishes', () => {
		for (const state of detailedStates()) {
			const urls = [
				state.llcFiling?.fileUrl,
				state.llcFiling?.nameSearchUrl,
				state.llcFiling?.feeUrl
			].filter(Boolean) as string[];
			for (const url of urls) {
				expect(url, `${state.name}: ${url}`).toMatch(/^https:\/\//);
			}
		}
	});

	it('includes California, the home state', () => {
		expect(findStateByCode('CA')?.sellerPermit).toBeDefined();
	});
});

describe('hasDetailedGuidance', () => {
	it('is true only when a seller permit is present', () => {
		expect(hasDetailedGuidance(fixture[1])).toBe(true);
		expect(hasDetailedGuidance(fixture[0])).toBe(false);
	});
});

describe('detailedStates and genericStates', () => {
	it('split the list with nothing lost or counted twice', () => {
		expect(detailedStates(fixture).map((s) => s.code)).toEqual(['CA']);
		expect(genericStates(fixture).map((s) => s.code)).toEqual(['AL', 'MA']);
		expect(detailedStates(fixture).length + genericStates(fixture).length).toBe(fixture.length);
	});
});

describe('findStateByCode', () => {
	it('matches regardless of case or surrounding space', () => {
		expect(findStateByCode('ca', fixture)?.name).toBe('California');
		expect(findStateByCode('  Ca  ', fixture)?.name).toBe('California');
	});

	it('returns undefined for a code that is not a state', () => {
		expect(findStateByCode('ZZ', fixture)).toBeUndefined();
	});
});

describe('searchStates', () => {
	it('matches on a name fragment, case-insensitively', () => {
		expect(searchStates('cali', fixture).map((s) => s.code)).toEqual(['CA']);
		expect(searchStates('MASS', fixture).map((s) => s.code)).toEqual(['MA']);
	});

	it('matches on the code when the name does not contain it', () => {
		expect(searchStates('ca', fixture).map((s) => s.code)).toEqual(['CA']);
	});

	it('matches code and name together - a filter box should be generous', () => {
		// "al" is Alabama's code and also sits inside "California". Both belong
		// in the results; narrowing to code-only would hide the state someone is
		// actually typing towards.
		expect(searchStates('al', fixture).map((s) => s.code)).toEqual(['AL', 'CA']);
	});

	it('returns everything for an empty or whitespace query, so clearing restores the list', () => {
		expect(searchStates('', fixture)).toHaveLength(3);
		expect(searchStates('   ', fixture)).toHaveLength(3);
	});

	it('returns nothing when there is no match', () => {
		expect(searchStates('atlantis', fixture)).toEqual([]);
	});
});

describe('coverageLabel', () => {
	it('states the real coverage rather than implying all states are covered', () => {
		expect(coverageLabel(fixture)).toBe('1 of 3');
	});
});
