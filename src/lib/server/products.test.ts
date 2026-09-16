import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
	env: { LYTEBUY_API_URL: 'http://api.test/api/v1' }
}));

const { formatPrice, getFeedProducts, FEED_LIMIT } = await import('./products');

/** Build a fetch stub that returns one canned JSON body. */
function jsonFetch(body: unknown, ok = true, status = 200) {
	return vi.fn(async () => ({
		ok,
		status,
		json: async () => body
	})) as unknown as typeof fetch;
}

describe('formatPrice', () => {
	it('renders whole dollars without trailing zeros', () => {
		// "$7" reads better on a card than "$7.00", and matches the copy the
		// hardcoded samples used.
		expect(formatPrice(700)).toBe('$7');
	});

	it('keeps cents when there are any', () => {
		expect(formatPrice(1899)).toBe('$18.99');
	});

	it('handles zero as a real price, not a missing one', () => {
		// Free listings exist - "$0" must not be treated the same as null, or a
		// free item silently disappears from the feed.
		expect(formatPrice(0)).toBe('$0');
	});

	it('returns null for anything that is not a finite number', () => {
		for (const bad of [null, undefined, 'seven', NaN, Infinity, {}]) {
			expect(formatPrice(bad)).toBeNull();
		}
	});
});

describe('getFeedProducts', () => {
	it('maps api items onto the card shape', async () => {
		const fetcher = jsonFetch({
			items: [
				{ title: 'Sourdough loaf', price_cents: 700, vendor: { name: 'Estrela Bakery' } }
			],
			next_cursor: null
		});

		expect(await getFeedProducts(fetcher)).toEqual([
			{ name: 'Sourdough loaf', vendor: 'Estrela Bakery', price: '$7' }
		]);
	});

	it('requests only what the feed row shows', async () => {
		const fetcher = jsonFetch({ items: [] });
		await getFeedProducts(fetcher);

		expect(fetcher).toHaveBeenCalledWith(`http://api.test/api/v1/products?limit=${FEED_LIMIT}`);
	});

	it('returns an empty list when nothing is listed yet', async () => {
		// The live case today: the api answers fine, with zero products.
		expect(await getFeedProducts(jsonFetch({ items: [], next_cursor: null }))).toEqual([]);
	});

	it('returns an empty list when the api errors', async () => {
		// Degrade, never throw - a marketing page that 500s because the backend
		// blipped is far worse than one showing no listings.
		expect(await getFeedProducts(jsonFetch({}, false, 503))).toEqual([]);
	});

	it('returns an empty list when the api is unreachable', async () => {
		const fetcher = vi.fn(async () => {
			throw new TypeError('fetch failed');
		}) as unknown as typeof fetch;

		expect(await getFeedProducts(fetcher)).toEqual([]);
	});

	it('drops items that cannot render rather than showing blanks', async () => {
		// A half-populated product would otherwise render as an empty card
		// sitting next to real ones.
		const fetcher = jsonFetch({
			items: [
				{ title: 'No price', vendor: { name: 'Shop' } },
				{ price_cents: 500, vendor: { name: 'Shop' } },
				{ title: 'No vendor', price_cents: 500 },
				{ title: 'Good one', price_cents: 500, vendor: { name: 'Shop' } }
			]
		});

		const products = await getFeedProducts(fetcher);
		expect(products).toHaveLength(1);
		expect(products[0].name).toBe('Good one');
	});

	it('accepts a flattened vendor name', async () => {
		const fetcher = jsonFetch({
			items: [{ title: 'Board', price_cents: 4800, vendor_name: 'Cedar & Pine' }]
		});

		expect((await getFeedProducts(fetcher))[0].vendor).toBe('Cedar & Pine');
	});

	it('makes a relative image path absolute', async () => {
		const fetcher = jsonFetch({
			items: [
				{
					title: 'Board',
					price_cents: 4800,
					vendor: { name: 'Cedar & Pine' },
					images: [{ url: '/media/board.jpg' }]
				}
			]
		});

		expect((await getFeedProducts(fetcher))[0].image).toBe('http://api.test/media/board.jpg');
	});

	it('leaves an already-absolute image url alone', async () => {
		const fetcher = jsonFetch({
			items: [
				{
					title: 'Board',
					price_cents: 4800,
					vendor: { name: 'Cedar & Pine' },
					images: ['https://cdn.example.com/board.jpg']
				}
			]
		});

		expect((await getFeedProducts(fetcher))[0].image).toBe('https://cdn.example.com/board.jpg');
	});

	it('survives a body that is not the expected shape', async () => {
		for (const body of [null, [], { items: 'nope' }, {}]) {
			expect(await getFeedProducts(jsonFetch(body))).toEqual([]);
		}
	});
});
