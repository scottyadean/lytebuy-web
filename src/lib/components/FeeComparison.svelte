<script lang="ts">
	// LB-Web-6. Fee comparison for /who-we-are, driven by
	// docs/reports/market-research.json (LB-Web-5) via the fees.ts helpers - no
	// arithmetic is inlined here, so a rate change in the data file flows
	// straight through to the bars and the copy.
	//
	// CSS bars rather than a charting library: the shapes are one-dimensional
	// and the site carries no chart dependency. A <table> underneath the visual
	// keeps the same numbers available to screen readers and to anyone with
	// styles off, since a div-with-a-width means nothing to either.
	import {
		barPercent,
		effectiveRate,
		formatMoney,
		formatRate,
		orderTotal,
		platformCost,
		savingVersus,
		type Platform,
		type Scenario
	} from '$lib/fees';

	interface Props {
		lytebuy: Platform;
		platforms: Platform[];
		scenarios: Scenario[];
	}

	let { lytebuy, platforms, scenarios }: Props = $props();

	// Only like-for-like marketplaces are charted. Shopify (a rented storefront
	// with no built-in demand) and Faire (wholesale) are flagged
	// comparable_to_lytebuy:false in the data and are named in the footnote
	// instead, because charting them as rivals would be misleading.
	const charted = $derived(platforms.filter((p) => p.comparable_to_lytebuy));
	const excluded = $derived(platforms.filter((p) => !p.comparable_to_lytebuy));

	// Holds only the user's choice. It starts null so the initial selection is
	// derived from the props rather than captured from them once at setup, which
	// keeps the default correct if `scenarios` ever changes.
	let chosenId = $state<string | null>(null);
	const scenario = $derived(
		scenarios.find((s) => s.id === chosenId) ?? scenarios[1] ?? scenarios[0]
	);
	const selectedId = $derived(scenario.id);
	const order = $derived({ itemPrice: scenario.item_price, shipping: scenario.shipping });

	// lytebuy first, then dearest to cheapest, so the eye lands on the contrast.
	const rows = $derived(
		[
			{ platform: lytebuy, isLytebuy: true },
			...charted
				.map((platform) => ({ platform, isLytebuy: false }))
				.sort((a, b) => platformCost(b.platform, order) - platformCost(a.platform, order))
		].map(({ platform, isLytebuy }) => ({
			platform,
			isLytebuy,
			cost: platformCost(platform, order),
			rate: effectiveRate(platform, order),
			saving: isLytebuy ? 0 : savingVersus(platform, lytebuy, order)
		}))
	);

	const maxCost = $derived(Math.max(...rows.map((r) => r.cost)));
	const dearest = $derived(rows.reduce((a, b) => (b.cost > a.cost ? b : a), rows[0]));
</script>

<div>
	<!-- Scenario picker. Radios, not buttons: this is one choice from a set, and
	     radios give keyboard and screen-reader semantics for free. -->
	<fieldset class="border-0 p-0">
		<legend class="text-sm font-semibold tracking-wide text-iron">
			On an order of
		</legend>
		<div class="mt-3 flex flex-wrap gap-2">
			{#each scenarios as option (option.id)}
				<label
					class="cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors
					       {selectedId === option.id
						? 'border-iron bg-iron text-white'
						: 'border-dust bg-surface text-charcoal hover:border-accent'}"
				>
					<input
						type="radio"
						name="fee-scenario"
						value={option.id}
						checked={selectedId === option.id}
						onchange={() => (chosenId = option.id)}
						class="sr-only"
					/>
					{option.chip_label ?? option.label}
				</label>
			{/each}
		</div>
	</fieldset>

	<!-- The bars are decorative duplicates of the table below, so they are hidden
	     from assistive tech rather than read out twice. -->
	<div class="mt-10 space-y-5" aria-hidden="true">
		{#each rows as row (row.platform.id)}
			<div>
				<div class="flex items-baseline justify-between gap-4 text-sm">
					<span class="font-semibold {row.isLytebuy ? 'text-accent' : 'text-iron'}">
						{row.platform.name}
					</span>
					<span class="tabular-nums {row.isLytebuy ? 'text-accent' : 'text-charcoal'}">
						{formatMoney(row.cost)}
						<span class="text-charcoal">({formatRate(row.rate)})</span>
					</span>
				</div>
				<div class="mt-2 h-3 overflow-hidden rounded-full bg-canvas">
					<div
						class="h-full rounded-full {row.isLytebuy ? 'bg-accent' : 'bg-thistle'}"
						style="width: {barPercent(row.cost, maxCost)}%"
					></div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Same numbers, readable. Visually hidden because the bars carry the
	     message sighted users need, but never removed from the DOM. -->
	<table class="sr-only">
		<caption>
			Platform fees on {scenario.label}, an order totalling {formatMoney(orderTotal(order))}
		</caption>
		<thead>
			<tr>
				<th scope="col">Platform</th>
				<th scope="col">Fee</th>
				<th scope="col">Share of the order</th>
				<th scope="col">Extra cost compared with lytebuy</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.platform.id)}
				<tr>
					<th scope="row">{row.platform.name}</th>
					<td>{formatMoney(row.cost)}</td>
					<td>{formatRate(row.rate)}</td>
					<td>{row.isLytebuy ? 'n/a' : `${formatMoney(row.saving)} more`}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<p class="mt-8 text-lg leading-relaxed">
		On a {(scenario.chip_label ?? scenario.label).toLowerCase()}, lytebuy takes
		<strong class="text-accent">{formatMoney(rows[0].cost)}</strong>. The same sale on
		{dearest.platform.name} costs
		<strong class="text-iron">{formatMoney(dearest.cost)}</strong> -
		<strong class="text-iron">{formatMoney(dearest.saving)} more</strong> out of the same order.
	</p>

	<!-- The caveats are not fine print to be buried. The comparison is only
	     defensible with them attached, so they render at readable size. -->
	<div class="mt-8 space-y-3 border-t border-dust pt-6 text-sm leading-relaxed text-charcoal">
		<!-- Two separate points, and they were fighting each other under one
		     heading: WHY the fee exists (Scott: someone pays to keep the app
		     running), and WHO actually hands it over (the buyer, not the vendor -
		     which is the caveat that makes the chart above a fair comparison). -->
		<p>
			<strong class="text-iron">Who pays for the servers.</strong> Someone has to keep the
			lights on, and that is what the {formatRate(lytebuy.fee_components[0].rate ?? 0)} at
			checkout pays for - not a cut of your craft. The buyer pays it, not you. On Etsy, eBay
			and Amazon that cut comes out of the seller's side.
		</p>
		<p>
			<strong class="text-iron">Card processing is not included.</strong> Stripe's fee is
			absorbed by the vendor on lytebuy, exactly as it is on the other platforms here, so leaving
			it off every row keeps the comparison fair.
		</p>
		<p>
			<strong class="text-iron">Groupon has no published rate.</strong> It is negotiated per
			merchant. The bar uses the middle of the 20-40% range in Groupon's own worked examples, and
			their commission sits on top of the discount the merchant funds. Vendors are also paid only
			when a voucher is redeemed, not when it sells.
		</p>
		{#if excluded.length}
			<p>
				<strong class="text-iron">Not charted.</strong>
				{excluded.map((p) => p.name).join(' and ')} are left out on purpose -
				{excluded.map((p) => p.comparable_note?.split('.')[0]?.toLowerCase()).join('; ')}.
			</p>
		{/if}
	</div>
</div>
