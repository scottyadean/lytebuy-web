<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact, site } from '$lib/config';
	import { team, toParagraphs } from '$lib/team';

	// The roster lives in $lib/team so the copy is edited in one place. The page
	// only decides how a member is laid out - photo left on odd cards, right on
	// even ones, so a growing list does not read as a column of identical rows.
	const members = team.map((member) => ({
		...member,
		paragraphs: toParagraphs(member.bio)
	}));

	// Marking up the people as an Organization graph gives search engines the
	// names and titles directly, rather than leaving them to parse the prose.
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: site.name,
		url: site.url,
		employee: team.map((member) => ({
			'@type': 'Person',
			name: member.name,
			jobTitle: member.role,
			image: `${site.url}${member.photo}`
		}))
	};
</script>

<Seo
	title="Team"
	description="The people building Lytebuy - who they are, what they have worked on, and why they are doing this."
	image={team[0]?.photo}
	{schema}
/>

<Hero
	title="A small team"
	accent="on your main street."
	lede="Lytebuy is built by people who grew up in towns like the ones we are building it for."
	poster="/img/main-street-day.jpg"
	posterAlt="A small-town main street in daylight"
/>

<Section tone="surface">
	<Reveal>
		<Eyebrow>Who is building it</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">The people behind Lytebuy.</h2>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			We are small on purpose. Everyone here has worked on something bigger and chose to build
			this instead.
		</p>
	</Reveal>

	<div class="mt-16 space-y-20 md:space-y-28">
		{#each members as member, index (member.slug)}
			<article id={member.slug} class="scroll-mt-28">
				<div
					class="grid items-start gap-10 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14
					       {index % 2 === 1 ? 'md:[&>figure]:order-2' : ''}"
				>
					<Reveal>
						<figure>
							<img
								src={member.photo}
								alt={member.photoAlt}
								width="960"
								height="960"
								loading={index === 0 ? 'eager' : 'lazy'}
								decoding="async"
								class="aspect-square w-full rounded-lg object-cover shadow-sm"
							/>
						</figure>
					</Reveal>

					<Reveal delay={80}>
						<div>
							<h3 class="text-title">{member.name}</h3>
							<p class="mt-2 font-display text-accent">{member.role}</p>
							{#if member.alsoRole}
								<p class="text-sm text-granite">{member.alsoRole}</p>
							{/if}

							<div class="mt-6 space-y-4">
								{#each member.paragraphs as paragraph, paragraphIndex (paragraphIndex)}
									<p class="leading-relaxed">{paragraph}</p>
								{/each}
							</div>

							{#if member.qoute}

							<div class="mt-6 space-y-4">
							<blockquote class="p-4 my-4 border-s-2 ">
								<p class="text-md italic 	">
								{member.qoute}
								</p>
								<cite class="block mt-2 text-sm ">— {member.name}</cite>
							</blockquote>
							</div>
							{/if}



							{#if member.priorWork?.length}
								<div class="mt-8 border-t border-charcoal/10 pt-6">
									<h4
										class="text-xs font-semibold tracking-[0.18em] text-granite uppercase"
									>
										Previously
									</h4>
									<ul class="mt-3 flex flex-wrap gap-x-2 gap-y-2">
										{#each member.priorWork as company (company)}
											<li
												class="rounded-full bg-canvas px-3 py-1 text-sm text-charcoal"
											>
												{company}
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					</Reveal>
				</div>
			</article>
		{/each}
	</div>
</Section>

<Section tone="iron" space="md">
	<Reveal>
		<Eyebrow onDark>Want in?</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">There is room for more of us.</h2>
		<p class="mt-6 max-w-2xl leading-relaxed text-dust">
			We are not always hiring, but we are always glad to hear from people who care about the
			same thing. Tell us what you would want to work on.
		</p>
		<div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
			<Button href="/get-involved#contact" variant="onDark" size="lg">Get in touch</Button>
			<a
				href="mailto:{contact.email}"
				class="text-sm text-dust transition-colors hover:text-thistle"
			>
				{contact.email}
			</a>
		</div>
	</Reveal>
</Section>
