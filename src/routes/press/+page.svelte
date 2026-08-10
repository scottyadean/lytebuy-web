<script lang="ts">
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact } from '$lib/config';
	import { formatDate, isoDate } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="Press"
	description="Announcements and press releases from Lytebuy, plus how to reach us for comment."
/>

<Section tone="surface" space="md">
	<Reveal>
		<Eyebrow>Press</Eyebrow>
		<h1 class="max-w-3xl text-display leading-[1.05]">Announcements and press releases.</h1>
		<p class="mt-6 max-w-xl text-lg leading-relaxed">
			Everything we have said on the record. For interviews, figures or images, write to
			<a href="mailto:{contact.email}" class="text-accent underline underline-offset-4">
				{contact.email}
			</a>.
		</p>
	</Reveal>
</Section>

<Section tone="canvas" space="md">
	{#if data.releases.length}
		<ul class="divide-y divide-dust border-y border-dust">
			{#each data.releases as release (release.id)}
				<li>
					<a
						href="/press/{release.slug}"
						class="group flex flex-col gap-2 py-7 transition-colors hover:bg-surface
						       md:flex-row md:items-baseline md:gap-8 md:px-4"
					>
						<time
							datetime={isoDate(release.created_date)}
							class="shrink-0 text-sm text-granite md:w-40"
						>
							{formatDate(release.created_date)}
						</time>
						<div>
							<h2 class="font-display text-xl transition-colors group-hover:text-accent">
								{release.title}
							</h2>
							{#if release.excerpt}
								<p class="mt-2 max-w-2xl leading-relaxed text-charcoal">{release.excerpt}</p>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="mx-auto max-w-md py-16 text-center">
			<h2 class="text-title">No releases yet.</h2>
			<p class="mt-4 leading-relaxed">
				When we have something on the record it will appear here. For anything urgent, write to
				<a href="mailto:{contact.email}" class="text-accent underline underline-offset-4">
					{contact.email}
				</a>.
			</p>
		</div>
	{/if}
</Section>
