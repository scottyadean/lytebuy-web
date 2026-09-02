<script lang="ts">
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="Blog"
	description="Notes on local commerce, small business and why main street is worth the detour."
	noindex={data.page > 1}
/>

<!-- Blog hero (LB-Web-4). The main street illustration moved here from
     /who-we-are and now sits BEHIND the heading rather than beside it.

     Not reusing Hero.svelte: that component is built for the photographic
     video/poster heroes and hard-codes a dark treatment (bg-iron plus two iron
     overlays, white type). This artwork is a light illustration - mid-blue sky,
     warm shopfronts - so the same overlays would bury it. Here the scrim runs the
     other way: a light wash over the picture keeping the existing dark type.

     Loaded as an <img>, not inlined: the file is ~270KB and carries its own
     <style> block (drifting clouds, the delivery truck), which would leak into
     the page if inlined. An <img> keeps that CSS scoped to the SVG document and
     lets the browser cache it. Decorative, so alt is empty - the heading says
     the same thing, and the SVG has its own title/desc. -->
<header class="relative isolate flex min-h-[42svh] items-end overflow-hidden bg-surface">
	<!-- object-bottom anchors the shopfront row to the base of the band, so the
	     sky (the empty part) is what gets cropped as the band grows. -->
	<img
		src="/img/main-street.svg"
		alt=""
		width="1270"
		height="635"
		fetchpriority="high"
		decoding="async"
		class="absolute inset-0 -z-10 h-full w-full object-cover object-bottom"
	/>

	<!-- ONE wash, not two. Mirrors Hero's overlay idea but inverted for a light
	     illustration, and deliberately a single layer: stacking a flat wash under
	     a gradient (as Hero does over video) multiplies out to near-white here and
	     erases the artwork.

	     The direction flips with the layout, because the copy does. On mobile the
	     text spans the full width and the art is cropped to a narrow slice, so a
	     left-to-right gradient would leave words sitting on shopfronts - there it
	     runs top-to-bottom, holding the type on the opaque top and letting the
	     street show through underneath. From md up the copy is a left-hand column,
	     so it switches to left-weighted and the shopfronts stay visible on the
	     right.

	     Alphas are as low as legibility allows (LB-Web-4.1 asked for a more
	     transparent mask). The binding constraint is the lede: charcoal at body
	     size needs 4.5:1 for AA, and measured against the DARKEST thing the copy
	     column can overlap (the #333 outlines, plus the awning/roof browns) it
	     holds at 80% surface (4.47:1) but fails by 75% (4.04:1) and 70% (3.64:1).
	     So 80% is the floor anywhere a glyph can land.

	     The stop POSITIONS matter as much as the alphas, and this is what caught
	     me out repeatedly. The copy is a fixed max-width inside a container that
	     centres once the viewport passes 76rem, so the text does not keep a fixed
	     relationship to the HEADER's left edge - which is what both percentage
	     stops and header-anchored rem stops measure from. Percentage stops failed
	     at 768-1024px (lede on alpha 0.36); pinning the stops in rem from the
	     header edge fixed that but failed at 1512px+ instead, because the centring
	     container walks the text rightwards while the stops stay put.

	     The fix is in the md:block element below: each stop is a calc() offset from
	     the same left margin the container computes, so the fade keeps a fixed
	     distance from the copy at any viewport. Stops: solid surface across the
	     text column, 80% just past the longest line, then down to 5% - the part
	     that lets the shopfronts through. Measured on the real page, the lede
	     lands on 5.07-5.31:1 and the h1 on 7.48-7.86:1 across 768-2560px, both
	     clear of AA. Re-check with the scratchpad contrast helper before lowering
	     any of this. -->
	<!-- Mobile: vertical fade, header-anchored (full-width copy, so no drift). -->
	<div
		class="absolute inset-0 -z-10 bg-gradient-to-b from-surface/95 from-40% via-surface/80 via-60% to-surface/15 md:hidden"
		aria-hidden="true"
	></div>
	<!-- md+: horizontal fade whose stops track the centred copy column.

	     One element, not three. An earlier attempt wrapped the gradient in a box
	     that matched the container's max-width so it would stay aligned to the
	     copy, but that box stops growing at 76rem while the header does not, and
	     its edges cut visible vertical seams into the artwork on wide screens.

	     Instead the stops are expressed as calc() offsets from the SAME left
	     margin the container computes - max(1.5rem, (100% - 76rem) / 2) - so the
	     fade keeps a fixed distance from the text at every width while the
	     gradient itself still spans the full header, leaving nothing to seam. -->
	<div
		class="absolute inset-0 -z-10 hidden md:block
		       bg-[linear-gradient(to_right,var(--color-surface)_0,var(--color-surface)_calc(max(1.5rem,(100%-76rem)/2)+30rem),color-mix(in_srgb,var(--color-surface)_80%,transparent)_calc(max(1.5rem,(100%-76rem)/2)+42rem),color-mix(in_srgb,var(--color-surface)_5%,transparent)_calc(max(1.5rem,(100%-76rem)/2)+70rem))]"
		aria-hidden="true"
	></div>

	<div class="container-page py-20 md:py-28">
		<Reveal>
			<Eyebrow>The blog</Eyebrow>
			<h1 class="max-w-3xl text-display leading-[1.05]">
				Notes from main street.
			</h1>
			<p class="mt-6 max-w-xl text-lg leading-relaxed">
				Why local commerce is worth defending, what we are building, and the shops keeping their
				towns interesting.
			</p>
		</Reveal>
	</div>
</header>

<Section tone="canvas" space="md">
	{#if data.posts.length}
		<div class="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
			{#each data.posts as post, index (post.id)}
				<Reveal delay={(index % 3) * 80}>
					<PostCard {post} featured={data.page === 1 && index === 0} />
				</Reveal>
			{/each}
		</div>

		{#if data.pageCount > 1}
			<nav class="mt-16 flex items-center justify-between border-t border-dust pt-8" aria-label="Pagination">
				{#if data.page > 1}
					<a
						href="/blog?page={data.page - 1}"
						class="text-sm font-medium text-accent hover:text-iron"
						rel="prev"
					>
						<span aria-hidden="true">&larr;</span> Newer
					</a>
				{:else}
					<span></span>
				{/if}

				<span class="text-sm text-granite">Page {data.page} of {data.pageCount}</span>

				{#if data.page < data.pageCount}
					<a
						href="/blog?page={data.page + 1}"
						class="text-sm font-medium text-accent hover:text-iron"
						rel="next"
					>
						Older <span aria-hidden="true">&rarr;</span>
					</a>
				{:else}
					<span></span>
				{/if}
			</nav>
		{/if}
	{:else}
		<!-- Also what a reader sees if the blog service is unreachable, which is a
		     better outcome for a marketing page than a 500. -->
		<div class="mx-auto max-w-md py-16 text-center">
			<h2 class="text-title">Nothing published yet.</h2>
			<p class="mt-4 leading-relaxed">
				The first posts are being written. Come back shortly, or
				<a href="/get-involved" class="text-accent underline underline-offset-4">say hello</a>
				in the meantime.
			</p>
		</div>
	{/if}
</Section>
