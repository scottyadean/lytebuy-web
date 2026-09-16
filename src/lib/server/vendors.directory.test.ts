import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/static/private', () => ({ LYTEBUY_API_URL: 'http://api.test/api/v1', LYTEBUY_APP_URL: 'https://app.test' }));

const { getDirectoryVendors, tradeLabel, DIRECTORY_LIMIT } = await import('./vendors');

function jsonFetch(body: unknown, ok = true, status = 200) {
	return vi.fn(async () => ({ ok, status, json: async () => body })) as unknown as typeof fetch;
}

function row(over: Record<string, unknown> = {}) {
	return { business_name: 'Estrela Bakery', slug: 'estrela-bakery', ...over };
}

describe('tradeLabel', () => {
	it('turns a snake_case enum into readable copy', () => {
		// "food_truck" printed raw on a marketing page looks like leaked db internals.
		expect(tradeLabel('food_truck')).toBe('Food truck');
	});

	it('returns null for a missing business type', () => {
		for (const bad of [null, undefined, '', 42]) expect(tradeLabel(bad)).toBeNull();
	});
});

describe('getDirectoryVendors', () => {
	it('maps a row onto the card shape', async () => {
		const vendors = await getDirectoryVendors(
			jsonFetch({ items: [row({ business_type: 'bakery', town: 'Placerville, CA' })] })
		);
		expect(vendors).toEqual([
			{
				name: 'Estrela Bakery',
				trade: 'Bakery',
				town: 'Placerville, CA',
				image: null,
				slug: 'estrela-bakery',
				storeUrl: 'https://app.test/store/estrela-bakery'
			}
		]);
	});

	it('prefers the vendor tagline over the business type', async () => {
		// Their own words beat a generic category when they have written some.
		const vendors = await getDirectoryVendors(
			jsonFetch({ items: [row({ tagline: 'Bread, baked at dawn', business_type: 'bakery' })] })
		);
		expect(vendors[0].trade).toBe('Bread, baked at dawn');
	});

	it('requests only what the grid shows', async () => {
		const fetcher = jsonFetch({ items: [] });
		await getDirectoryVendors(fetcher);
		expect(fetcher).toHaveBeenCalledWith(
			`http://api.test/api/v1/vendors/directory?limit=${DIRECTORY_LIMIT}`
		);
	});

	it('returns an empty list when nobody has signed up', async () => {
		expect(await getDirectoryVendors(jsonFetch({ items: [], next_cursor: null }))).toEqual([]);
	});

	it('returns an empty list when the api errors', async () => {
		// Degrade, never throw: a marketing page that 500s because the backend
		// blipped is worse than one showing no vendors.
		expect(await getDirectoryVendors(jsonFetch({}, false, 503))).toEqual([]);
	});

	it('returns an empty list when the api is unreachable', async () => {
		const fetcher = vi.fn(async () => {
			throw new TypeError('fetch failed');
		}) as unknown as typeof fetch;
		expect(await getDirectoryVendors(fetcher)).toEqual([]);
	});

	it('drops a row with no slug rather than rendering a dead link', async () => {
		const vendors = await getDirectoryVendors(
			jsonFetch({ items: [row({ slug: '' }), row({ business_name: 'Good', slug: 'good' })] })
		);
		expect(vendors.map((v) => v.name)).toEqual(['Good']);
	});

	it('leaves town null when the vendor has pinned no location', async () => {
		// The card hides the line; an empty town reads as a bug.
		const vendors = await getDirectoryVendors(jsonFetch({ items: [row({ town: null })] }));
		expect(vendors[0].town).toBeNull();
	});

	it('survives a body that is not the expected shape', async () => {
		for (const body of [null, [], { items: 'nope' }, {}]) {
			expect(await getDirectoryVendors(jsonFetch(body))).toEqual([]);
		}
	});
});
