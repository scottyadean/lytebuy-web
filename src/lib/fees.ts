/**
 * Marketplace fee maths for the /who-we-are comparison (LB-Web-6).
 *
 * Every formula in the comparison lives here and is called from the page - no
 * arithmetic is inlined at a call site, so a rate change in
 * docs/reports/market-research.json flows through one code path.
 *
 * Data source: docs/reports/market-research.json (LB-Web-5). Rates there are
 * decimals (0.065 = 6.5%).
 */

/** One priced fee component from the research file. */
export interface FeeComponent {
	key: string;
	label: string;
	type: string;
	rate?: number;
	fixed?: number;
	amount?: number;
	amount_low?: number;
	amount_high?: number;
	threshold?: number;
	rate_above_threshold?: number;
	rate_min?: number;
	rate_max?: number;
	rate_typical?: number;
	paid_by?: string;
}

export interface Platform {
	id: string;
	name: string;
	category: string;
	comparable_to_lytebuy?: boolean;
	comparable_note?: string;
	is_voucher_platform?: boolean;
	fee_components: FeeComponent[];
	effective_rate_note?: string;
	source_url?: string;
}

export interface Scenario {
	id: string;
	/** Full description, e.g. "$75 item, free shipping". Used in the accessible
	 *  table caption where the detail matters. */
	label: string;
	/** Short noun phrase, e.g. "$75 order". Used on the picker chips and in the
	 *  summary sentence, where the full label does not read as English. */
	chip_label?: string;
	item_price: number;
	shipping: number;
	voucher?: boolean;
}

/** An order as the fee maths sees it. */
export interface Order {
	itemPrice: number;
	shipping: number;
}

/** Money to 2dp. Fee schedules are cent-denominated, so round once at the end
 *  of each component rather than letting float noise accumulate. */
export function roundMoney(value: number): number {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** What the buyer hands over before any platform fee. Etsy and eBay both charge
 *  on this total INCLUDING shipping, which is why it is its own function. */
export function orderTotal(order: Order): number {
	return roundMoney(order.itemPrice + order.shipping);
}

/**
 * Cost of a single fee component on an order.
 *
 * Returns 0 for component types that are not a per-order cost (a monthly
 * subscription, a per-new-customer fee), so a caller can sum every component
 * without special-casing. Those are surfaced separately as context, not folded
 * into a per-order comparison where they would be misleading.
 */
export function componentCost(component: FeeComponent, order: Order): number {
	const total = orderTotal(order);

	switch (component.type) {
		case 'percent_of_subtotal':
			// Charged on the item only - shipping is excluded.
			return roundMoney(order.itemPrice * (component.rate ?? 0));

		case 'percent_of_order_total':
			// A rate that steps down above a threshold (eBay's per-item cap).
			if (component.threshold !== undefined && component.rate_above_threshold !== undefined) {
				const upTo = Math.min(total, component.threshold);
				const above = Math.max(0, total - component.threshold);
				return roundMoney(
					upTo * (component.rate ?? 0) + above * component.rate_above_threshold
				);
			}
			return roundMoney(total * (component.rate ?? 0));

		case 'percent_plus_fixed':
			return roundMoney(total * (component.rate ?? 0) + (component.fixed ?? 0));

		case 'fixed_per_listing':
			return roundMoney(component.amount ?? 0);

		case 'fixed_per_order_tiered':
			// eBay: one amount at or below the threshold, another above it.
			return roundMoney(
				total <= (component.threshold ?? 0)
					? (component.amount_low ?? 0)
					: (component.amount_high ?? 0)
			);

		case 'percent_of_voucher_range':
			// Groupon publishes no fixed rate. Use the midpoint of their own
			// worked examples; callers show the range alongside it.
			return roundMoney(total * (component.rate_typical ?? 0));

		// Not a per-order cost. Reported separately rather than amortised, since
		// spreading a subscription over an unknown order count would be a made-up
		// number dressed as a measurement.
		case 'fixed_monthly_tiered':
		case 'fixed_monthly':
		case 'fixed_per_new_customer':
			return 0;

		default:
			return 0;
	}
}

/**
 * Total a seller loses to a platform on one order.
 *
 * Faire is the one platform whose components are ALTERNATIVES rather than a sum
 * (first-order vs repeat commission); summing them would double-count, so the
 * repeat rate is dropped and the first-order rate stands as the headline.
 */
export function platformCost(platform: Platform, order: Order): number {
	const components = platform.fee_components.filter(
		(component) => component.key !== 'commission_repeat'
	);
	return roundMoney(
		components.reduce((sum, component) => sum + componentCost(component, order), 0)
	);
}

/** Cost as a share of what the buyer paid. The honest "what does this actually
 *  cost me" number, since headline rates hide flat fees. */
export function effectiveRate(platform: Platform, order: Order): number {
	const total = orderTotal(order);
	if (total <= 0) return 0;
	return platformCost(platform, order) / total;
}

/** What the vendor keeps after the platform takes its cut. */
export function vendorKeeps(platform: Platform, order: Order): number {
	return roundMoney(orderTotal(order) - platformCost(platform, order));
}

/** Difference between a platform's cut and lytebuy's on the same order. */
export function savingVersus(platform: Platform, lytebuy: Platform, order: Order): number {
	return roundMoney(platformCost(platform, order) - platformCost(lytebuy, order));
}

/** Bar width as a percentage of the widest bar in a set, so a chart scales to
 *  its own data instead of assuming a maximum. Guards an all-zero set. */
export function barPercent(value: number, max: number): number {
	if (max <= 0) return 0;
	return Math.max(0, Math.min(100, (value / max) * 100));
}

/** "6.5%" - one decimal place, trailing ".0" dropped. */
export function formatRate(rate: number): string {
	const pct = rate * 100;
	const fixed = pct.toFixed(1);
	return `${fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed}%`;
}

/** "$3.78". Whole dollars drop the cents so headline figures stay clean. */
export function formatMoney(value: number): string {
	const rounded = roundMoney(value);
	return Number.isInteger(rounded) ? `$${rounded}` : `$${rounded.toFixed(2)}`;
}
