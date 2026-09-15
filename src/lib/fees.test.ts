// LB-Web-6: the /who-we-are savings charts are only as trustworthy as this
// arithmetic, and they make a public claim about competitors' pricing. These
// tests pin the maths against each platform's OWN published example where one
// exists, so a wrong number fails here rather than on the marketing page.

import { describe, expect, it } from 'vitest';

import research from '$lib/data/market-research.json';
import {
	barPercent,
	componentCost,
	effectiveRate,
	formatMoney,
	formatRate,
	orderTotal,
	platformCost,
	roundMoney,
	savingVersus,
	vendorKeeps,
	type Platform
} from './fees';

const platforms = research.platforms as unknown as Platform[];
const lytebuy = research.lytebuy as unknown as Platform;
const byId = (id: string): Platform => {
	const found = platforms.find((p) => p.id === id);
	if (!found) throw new Error(`no platform ${id} in market-research.json`);
	return found;
};

describe('orderTotal', () => {
	it('includes shipping - Etsy and eBay both charge their cut on it', () => {
		expect(orderTotal({ itemPrice: 30, shipping: 5 })).toBe(35);
	});
});

describe('roundMoney', () => {
	it('rounds to cents', () => {
		expect(roundMoney(3.7825)).toBe(3.78);
	});

	it('does not lose a half cent to float error', () => {
		// 1.005 is the classic float case: it is really 1.00499...
		expect(roundMoney(2.675)).toBe(2.68);
	});
});

describe('Etsy', () => {
	const etsy = byId('etsy');

	// The load-bearing test. Etsy's own published example is $3.78 of mandatory
	// fees on a $30 item with $5 shipping. If this drifts, the data file is wrong.
	it('reproduces Etsy published $3.78 on a $30 item with $5 shipping', () => {
		expect(platformCost(etsy, { itemPrice: 30, shipping: 5 })).toBe(3.78);
	});

	it('charges its transaction fee on shipping too, not just the item', () => {
		const withShipping = platformCost(etsy, { itemPrice: 30, shipping: 5 });
		const without = platformCost(etsy, { itemPrice: 30, shipping: 0 });
		expect(withShipping).toBeGreaterThan(without);
	});

	it('costs proportionally MORE on small orders, where the flat fees bite', () => {
		const small = effectiveRate(etsy, { itemPrice: 10, shipping: 0 });
		const large = effectiveRate(etsy, { itemPrice: 250, shipping: 12 });
		expect(small).toBeGreaterThan(large);
		// The corrected range recorded in the research file: 9.7-14%.
		expect(small).toBeCloseTo(0.14, 2);
		expect(large).toBeCloseTo(0.097, 3);
	});
});

describe('eBay', () => {
	const ebay = byId('ebay');

	it('adds the $0.30 per-order fee at or below $10', () => {
		// 13.6% of 10 = 1.36, plus 0.30 = 1.66
		expect(platformCost(ebay, { itemPrice: 10, shipping: 0 })).toBe(1.66);
	});

	it('switches to the $0.40 fee above $10', () => {
		// 13.6% of 35 = 4.76, plus 0.40 = 5.16
		expect(platformCost(ebay, { itemPrice: 30, shipping: 5 })).toBe(5.16);
	});

	it('steps the rate down above the $7,500 per-item threshold', () => {
		// 7500 * 0.136 + 500 * 0.0235 + 0.40
		const cost = platformCost(ebay, { itemPrice: 8000, shipping: 0 });
		expect(cost).toBe(roundMoney(7500 * 0.136 + 500 * 0.0235 + 0.4));
		// Without the step-down it would be 8000 * 0.136 + 0.40 = 1088.40.
		expect(cost).toBeLessThan(1088.4);
	});

	it('really costs more than its 13.6% headline once the flat fee lands', () => {
		expect(effectiveRate(ebay, { itemPrice: 30, shipping: 5 })).toBeGreaterThan(0.136);
	});
});

describe('lytebuy', () => {
	it('charges 4% of the ITEM, not of shipping', () => {
		// The distinction matters: the competitors above all charge on shipping.
		expect(platformCost(lytebuy, { itemPrice: 30, shipping: 5 })).toBe(1.2);
		expect(platformCost(lytebuy, { itemPrice: 30, shipping: 0 })).toBe(1.2);
	});

	it('is cheaper than every platform marked comparable, on every scenario', () => {
		const comparable = platforms.filter((p) => p.comparable_to_lytebuy);
		expect(comparable.length).toBeGreaterThan(0);
		for (const scenario of research.comparison_scenarios) {
			const order = { itemPrice: scenario.item_price, shipping: scenario.shipping };
			for (const platform of comparable) {
				expect(platformCost(lytebuy, order)).toBeLessThan(platformCost(platform, order));
			}
		}
	});
});

describe('Groupon', () => {
	const groupon = byId('groupon');

	it('prices from the midpoint of the published range, not a made-up figure', () => {
		// Groupon publishes no fixed rate; 30% is the middle of their own
		// 20/30/40% worked examples.
		expect(platformCost(groupon, { itemPrice: 50, shipping: 0 })).toBe(15);
	});

	it('still records the full range so the page can show it honestly', () => {
		const commission = groupon.fee_components[0];
		expect(commission.rate_min).toBe(0.2);
		expect(commission.rate_max).toBe(0.4);
	});
});

describe('componentCost', () => {
	it('returns 0 for a monthly subscription - not a per-order cost', () => {
		const shopify = byId('shopify');
		const subscription = shopify.fee_components.find((c) => c.key === 'subscription');
		expect(subscription).toBeDefined();
		expect(componentCost(subscription!, { itemPrice: 75, shipping: 0 })).toBe(0);
	});

	it('returns 0 for an unknown component type rather than NaN', () => {
		expect(componentCost({ key: 'x', label: 'x', type: 'not_a_real_type' }, { itemPrice: 50, shipping: 0 })).toBe(0);
	});
});

describe('platformCost', () => {
	it('does not double-count Faire first-order and repeat commission', () => {
		const faire = byId('faire');
		// 25% first-order, NOT 25% + 15%.
		expect(platformCost(faire, { itemPrice: 100, shipping: 0 })).toBe(25);
	});
});

describe('vendorKeeps and savingVersus', () => {
	it('vendorKeeps is the order total minus the platform cut', () => {
		const order = { itemPrice: 75, shipping: 0 };
		expect(vendorKeeps(lytebuy, order)).toBe(72);
	});

	it('savings against Etsy on a $75 order is the difference of the two cuts', () => {
		const order = { itemPrice: 75, shipping: 0 };
		const etsy = byId('etsy');
		expect(savingVersus(etsy, lytebuy, order)).toBe(
			roundMoney(platformCost(etsy, order) - platformCost(lytebuy, order))
		);
		expect(savingVersus(etsy, lytebuy, order)).toBeGreaterThan(0);
	});
});

describe('barPercent', () => {
	it('scales to the widest bar', () => {
		expect(barPercent(5, 10)).toBe(50);
		expect(barPercent(10, 10)).toBe(100);
	});

	it('never divides by zero on an all-zero set', () => {
		expect(barPercent(0, 0)).toBe(0);
	});

	it('clamps rather than overflowing its track', () => {
		expect(barPercent(20, 10)).toBe(100);
		expect(barPercent(-5, 10)).toBe(0);
	});
});

describe('formatting', () => {
	it('formats rates without a trailing .0', () => {
		expect(formatRate(0.065)).toBe('6.5%');
		expect(formatRate(0.04)).toBe('4%');
		expect(formatRate(0.136)).toBe('13.6%');
	});

	it('formats money, dropping cents on whole dollars', () => {
		expect(formatMoney(3.78)).toBe('$3.78');
		expect(formatMoney(15)).toBe('$15');
	});
});

describe('research data integrity', () => {
	it('every comparable platform costs more than lytebuy - the page claim', () => {
		// If this ever fails the /who-we-are copy is making a false claim.
		const order = { itemPrice: 75, shipping: 0 };
		const cheapest = platforms
			.filter((p) => p.comparable_to_lytebuy)
			.map((p) => platformCost(p, order));
		expect(Math.min(...cheapest)).toBeGreaterThan(platformCost(lytebuy, order));
	});

	it('flags Shopify and Faire as NOT like-for-like comparisons', () => {
		expect(byId('shopify').comparable_to_lytebuy).toBe(false);
		expect(byId('faire').comparable_to_lytebuy).toBe(false);
	});

	it('gives every scenario a short chip_label that reads as a noun phrase', () => {
		// The summary sentence says "On a {chip_label}, lytebuy takes ...", so a
		// missing or over-long label turns the copy into nonsense.
		for (const scenario of research.comparison_scenarios) {
			expect(scenario.chip_label, `${scenario.id} has no chip_label`).toBeTruthy();
			expect(scenario.chip_label!.length).toBeLessThan(20);
		}
	});

	it('carries a source url for every platform', () => {
		for (const platform of platforms) {
			expect(platform.source_url, `${platform.id} has no source`).toBeTruthy();
		}
	});
});
