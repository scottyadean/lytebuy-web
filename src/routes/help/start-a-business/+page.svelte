<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { STATES, coverageLabel, searchStates } from '$lib/business-registration';
	import { IRS_EIN_ASSISTANT_URL, einWindow } from '$lib/ein';
	import { appLinks, contact } from '$lib/config';

	// Setting up a store is the part people are afraid of and it is the part
	// that is genuinely easy, so it leads. The EIN, which is the actual
	// stumbling block, gets its own section further down.
	const setupSteps = [
		{
			title: 'Fill out the form',
			time: 'About 10 minutes',
			body: 'Your business name, what you sell, where you are, and how to reach you.',
			detail:
				'If you do not have your EIN yet, keep going. You can fill in everything else and add it before you submit for approval.'
		},
		{
			title: 'Set up your storefront',
			time: 'About 5 minutes',
			body: 'Your shop name as customers should see it, a short description, and your hours.',
			detail:
				'Write the description the way you would say it to someone at the counter. Two or three sentences is plenty.'
		},
		{
			title: 'Add a background photo',
			time: 'About 2 minutes',
			body: 'One wide photo across the top of your shop page. Your storefront, your counter, your best table, your truck.',
			detail:
				'A photo from your phone is fine. Shoot it sideways, in daylight, and leave some room at the top so your name has somewhere to sit.'
		},
		{
			title: 'Add your products and prices',
			time: '2 minutes each',
			body: 'A name, a price, a photo, and a line about what it is.',
			detail:
				'You do not need your whole menu on day one. Start with five things you are known for. You can add the rest whenever.'
		},
		{
			title: 'Submit and wait for approval',
			time: 'Usually a day or two',
			body: 'We check that you are a real business and that the listing is what it says it is. Then you are live.',
			detail:
				'We will email you the moment it is approved. If something needs fixing, we tell you exactly what, and you resubmit.'
		}
	];

	// What you actually need before you can finish the form. Deliberately short:
	// a sole proprietor needs almost none of the paperwork the old version of
	// this page implied, and saying so is the single most useful thing here.
	const beforeYouStart = [
		{
			title: 'A name and a way to be paid',
			body: 'Your own name works. A bank account and a phone are enough to get set up and approved.'
		},
		{
			title: 'Add photos and Videos',
			body: 'Make your products look good, I can\'t stress this enough. Go the extra mile to present well.'
		},
		{
			title: "A seller's permit, usually",
			body: 'If you sell taxable goods, most states want you registered with their revenue department. It is free in most states and quick.'
		},
		{
			title: 'An EIN, only sometimes',
			body: 'Optional for a sole proprietor - your SSN works. You need one if you form an LLC, hire anyone, or would rather not give out your SSN.'
		}
	];

	// The two honest paths. Most Lytebuy vendors are the first one and have been
	// told for years that they need the second.
	const paths = [
		{
			title: 'Sole proprietor',
			blurb: 'The default. If you start selling under your own name, you are one already.',
			points: [
				'No formation filing with the state. Nothing to submit, nothing to wait for.',
				'No EIN needed - you can use your Social Security Number.',
				'You and the business are the same legal person, so there is no liability separation.',
				'File a DBA only if you want to trade under a name that is not your own.'
			]
		},
		{
			title: 'LLC',
			blurb: 'Worth it when you want your personal savings separated from the business.',
			points: [
				'File Articles of Organization with your state and wait for approval.',
				'Get an EIN from the IRS once the state approves you.',
				'Costs a filing fee up front, and most states charge an annual fee after.',
				'Keeps your personal assets separate if the business is ever sued or owes money.'
			]
		}
	];

	// The paperwork people actually hit. None of it is the Secretary of State,
	// and three of the four are county or city level - which is why this page
	// explains them rather than pretending to link every jurisdiction.
	const realPaperwork = [
		{
			title: 'A DBA, if you trade under another name',
			where: 'Usually your county clerk',
			body: 'Also called a fictitious business name. You need one only if your shop name is not your own legal name. In California you must also publish it in a local newspaper for four weeks and file proof.'
		},
		{
			title: "A seller's permit",
			where: 'Your state revenue department',
			body: 'Not the Secretary of State - a different agency. Required in most states before you sell taxable goods, whatever structure you chose. Usually free and often issued the same day.'
		},
		{
			title: 'A city or county business license',
			where: 'Your city or county',
			body: 'Hyper-local, and there are thousands of jurisdictions. Search for your city name plus "business license" and start at the official .gov result.'
		},
		{
			title: 'A cottage food permit, for anything edible',
			where: 'Your county health department',
			body: 'If you sell food you made at home, this is usually the one that matters. Rules vary sharply even between counties in the same state, including what you are allowed to make and how much you can sell.'
		}
	];

	const einBefore = [
		'If you are forming an LLC, wait for the state to approve it before you apply. A sole proprietor can apply straight away.',
		'Have your legal business name, state of formation, and formation date in front of you.',
		"Have the responsible party's Social Security Number or ITIN. That is usually you.",
		'Set aside fifteen uninterrupted minutes. The IRS does not save a partial application.'
	];

	const einSteps = [
		'Open the IRS EIN Assistant and choose Apply Online Now.',
		'Choose your legal structure - Sole Proprietor or Limited Liability Company (LLC).',
		'Give your reason for applying: started a new business, or opened a bank account.',
		'Enter the name and taxpayer ID (SSN or ITIN) of the responsible party.',
		"Enter your business's official name, address, and state details.",
		'Review everything and submit.',
		'Save, copy, and print the EIN confirmation the moment it appears. This is the only time it is shown.'
	];

	// Rendered on the server as well as the client, so someone on a slow phone
	// sees the real answer in the first paint rather than a flash of "checking".
	const irs = einWindow(new Date());

	let query = $state('');
	const filtered = $derived(searchStates(query, STATES));
	const filteredDetailed = $derived(filtered.filter((state) => state.sellerPermit));
	const filteredGeneric = $derived(filtered.filter((state) => !state.sellerPermit));

	const faq = [
		{
			q: 'Do I need an LLC to sell on Lytebuy?',
			a: 'No. If you sell under your own name you are a sole proprietor, and there is no formation paperwork to file with your state. An LLC is worth it when you want your personal savings separated from the business, but it is a choice, not a requirement.'
		},
		{
			q: 'Do I need an EIN?',
			a: 'Not if you are a sole proprietor - you can use your Social Security Number. You need an EIN if you form an LLC, hire employees, or would rather not give out your SSN.'
		},
		{
			q: 'Can I set up my shop before the paperwork is done?',
			a: 'Yes. Create your account, build your storefront, and add your products now. You can sort out a seller\'s permit or a local licence after, and add those details when you have them.'
		},
		{
			q: 'How much does an EIN cost?',
			a: 'Nothing. The IRS issues an EIN free through its online EIN Assistant, usually in about fifteen minutes. Any site charging you for one is reselling a free service.'
		},
		{
			q: 'How long does approval take?',
			a: 'Usually a day or two. We check that you are a real business and that your listing matches what you actually sell, then you are live.'
		},
		{
			q: 'Can I start setting up before my EIN arrives?',
			a: 'Yes. Fill in your storefront, add your photo, add your products. Add the EIN before you submit for approval.'
		},
		{
			q: 'What does it cost to sell on Lytebuy?',
			a: 'Listing your business and posting promotions is free. On an online sale, a 4% platform fee is added to the buyer at checkout, so you keep 100% of your sale price. Taking a card in person costs 1.2% of the sale, plus the card processing fee.'
		},
		{
			q: 'How are taxes handled?',
			a: 'You do not have to manage sales tax. It is calculated and collected at checkout based on where the buyer is, and Lytebuy remits it for you. Income tax on your earnings is still yours to handle, and we provide revenue reports to help you work it out.'
		}
	];
</script>

<Seo
	title="How to start a business on Lytebuy"
	description="A plain walkthrough for getting your shop live on Lytebuy: set up your storefront, add products, and get approved. Includes how to register your business by state and how to get your EIN free from the IRS."
	schema={{
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.map((item) => ({
			'@type': 'Question',
			name: item.q,
			acceptedAnswer: { '@type': 'Answer', text: item.a }
		}))
	}}
/>

<Hero
	title="Start a business"
	accent="on lytebuy."
	lede="Set up your shop, add your products, and get approved. Most people are done in half an hour."
	poster="/img/come-in-were-awesome.jpg"
	posterAlt="A hanging shop sign reading Come in, we're awesome"
>
	{#snippet actions()}
		<Button href="#setup" variant="onDark" size="lg">Start the walkthrough</Button>
		<Button href="#register" size="lg" class="border border-white/40 text-white hover:bg-white/10">
			What paperwork you need
		</Button>
	{/snippet}
</Hero>

<!-- The reassurance up front. Someone on a phone deciding whether to bother
     should be able to read this bit alone and know what they are in for. -->
<Section tone="surface">
	<Reveal>
		<Eyebrow>Quick Start</Eyebrow>
		<h2 class="max-w-3xl text-display leading-[1.05]">
			Set up a business in a few steps
		</h2>
		<div class="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed">
			<p>Lytebuy makes it easy to start selling:</p>
			<ul class="ml-5 list-disc space-y-2">
				<li>Create a vendor account on Lytebuy.</li>
				<li>Add your products - physical goods, redeemable vouchers, or digital downloads.</li>
				<li>Add your details to your Lytebuy storefront.</li>
				<li>Submit your shop, and we check you are a real business.</li>
			</ul>

			<p>
				You can set your account up today and sort the paperwork out after. If you are selling
				under your own name, there may be no formation paperwork at all - see below.
			</p>

			<Button href="/sell" variant={'secondary'} size="md">
				Start selling
			</Button>

		</div>
	</Reveal>

	<div class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
		{#each beforeYouStart as item, index (item.title)}
			<Reveal delay={index * 60}>
				<div class="border-t-2 border-thistle pt-5">
					<h3 class="text-lg">{item.title}</h3>
					<p class="mt-2 text-[0.9375rem] leading-relaxed">{item.body}</p>
				</div>
			</Reveal>
		{/each}
	</div>
</Section>

<!-- Setting up the shop -->
<Section id="setup" tone="accent">
	<Reveal>
		<Eyebrow>Setting up your shop</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Five steps to your storefront</h2>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			You can do all of this on your phone, standing behind your own counter.
		</p>
	</Reveal>

	<!-- Reveal sits inside each <li>, not around it: an <ol> whose children are
	     <div>s is invalid markup and stops assistive tech announcing this as a
	     list of five steps, which is the one thing the section is telling you. -->
	<ol class="mt-14 space-y-10">
		{#each setupSteps as item, index (item.title)}
			<li class="border-t border-dust pt-6">
				<Reveal delay={index * 60} class="flex gap-5 md:gap-8">
					<span class="font-display text-2xl text-accent md:text-3xl" aria-hidden="true">
						{String(index + 1).padStart(2, '0')}
					</span>
					<div class="max-w-2xl">
						<div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
							<h3 class="text-lg">{item.title}</h3>
							<span class="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
								{item.time}
							</span>
						</div>
						<p class="mt-2 leading-relaxed">{item.body}</p>
						<p class="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">{item.detail}</p>
					</div>
				</Reveal>
			</li>
		{/each}
	</ol>
</Section>

<!-- EIN. The stumbling block, given the most room on the page. -->
<Section id="ein" tone="surface">
	<Reveal>
		<Eyebrow>Going Legit</Eyebrow>
		<h2 class="max-w-3xl text-display leading-[1.05]">
			Get your EIN free from the IRS
		</h2>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			An EIN, or Employer Identification Number, is your business's tax ID. You get it directly
			from the IRS online and it costs nothing. If a website is charging you for one, close the
			tab - they are reselling something the IRS gives away.
		</p>
		<p class="mt-4 max-w-2xl text-lg leading-relaxed">
			<strong class="text-iron">You may not need one.</strong> A sole proprietor can use their
			Social Security Number instead. Get an EIN if you form an LLC, hire anyone, or would simply
			rather not hand out your SSN.
		</p>
	</Reveal>

	<Reveal>
		<!-- The IRS tool keeps office hours and discards partial applications, so
		     the page says whether it is open right now rather than letting someone
		     start at 9.55pm and lose the lot. -->
		<div
			class="mt-10 max-w-2xl border-l-4 p-5 {irs.open && !irs.closingSoon
				? 'border-accent bg-accent-soft'
				: 'border-thistle bg-canvas'}"
		>
			<p class="text-[0.9375rem] leading-relaxed">
				<strong class="text-iron">{irs.open ? 'Open right now.' : 'Closed right now.'}</strong>
				{irs.message}
			</p>
		</div>
	</Reveal>

	<div class="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
		<Reveal>
			<h3 class="text-lg">Before you apply</h3>
			<ul class="mt-5 space-y-4">
				{#each einBefore as item (item)}
					<li class="flex gap-3 text-[0.9375rem] leading-relaxed">
						<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"
						></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
			<p class="mt-6 text-[0.9375rem] leading-relaxed text-charcoal">
				If you are forming an LLC, the most common mistake is applying before the state has
				approved it. Wait for the approval, then apply.
			</p>
		</Reveal>

		<Reveal delay={80}>
			<h3 class="text-lg">The application, step by step</h3>
			<ol class="mt-5 space-y-4">
				{#each einSteps as item, index (item)}
					<li class="flex gap-4 text-[0.9375rem] leading-relaxed">
						<span class="font-display text-base text-thistle" aria-hidden="true">
							{index + 1}
						</span>
						<span>{item}</span>
					</li>
				{/each}
			</ol>
			<div class="mt-8">
				<Button href={IRS_EIN_ASSISTANT_URL} size="lg" rel="noopener" target="_blank">
					Open the IRS EIN Assistant
				</Button>
			</div>
			<p class="mt-4 text-sm leading-relaxed text-charcoal">
				Opens on irs.gov. Save your confirmation letter somewhere you will find it again - the
				IRS shows the number once, and getting a replacement means phoning them.
			</p>
		</Reveal>
	</div>
</Section>

<!-- The paperwork, told honestly. The old version of this section sent every
     reader to the Secretary of State, which is simply wrong for a sole
     proprietor - they file nothing to exist. -->
<Section id="register" tone="canvas">
	<Reveal>
		<Eyebrow>Paperwork</Eyebrow>
		<h2 class="max-w-3xl text-display leading-[1.05]">Two paths, and most people are on the first</h2>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed">
			You do not have to form a company to sell. If you start selling under your own name, you
			are already a sole proprietor, and there is nothing to file with the state to become one.
		</p>
	</Reveal>

	<div class="mt-12 grid gap-8 md:grid-cols-2">
		{#each paths as path, index (path.title)}
			<Reveal delay={index * 80}>
				<div class="h-full border-t-2 border-thistle bg-surface p-6">
					<h3 class="text-lg">{path.title}</h3>
					<p class="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">{path.blurb}</p>
					<ul class="mt-5 space-y-3">
						{#each path.points as point (point)}
							<li class="flex gap-3 text-[0.9375rem] leading-relaxed">
								<span
									class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
									aria-hidden="true"
								></span>
								<span>{point}</span>
							</li>
						{/each}
					</ul>
				</div>
			</Reveal>
		{/each}
	</div>

	<Reveal>
		<div class="mt-16 border-t border-dust pt-10">
			<h3 class="text-lg">What you will actually run into</h3>
			<p class="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
				Most of this is local, not state level. Three of the four below are handled by your
				county or city, which is why we explain them rather than pretend to link every
				jurisdiction in the country.
			</p>
		</div>
	</Reveal>

	<ul class="mt-10 grid gap-8 sm:grid-cols-2">
		{#each realPaperwork as item, index (item.title)}
			<li class="border-t border-dust pt-5">
				<Reveal delay={index * 60}>
					<span class="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
						{item.where}
					</span>
					<h4 class="mt-2 font-display text-lg text-iron">{item.title}</h4>
					<p class="mt-2 text-[0.9375rem] leading-relaxed">{item.body}</p>
				</Reveal>
			</li>
		{/each}
	</ul>

	<Reveal>
		<div class="mt-16 border-t border-dust pt-10">
			<h3 class="text-lg">Find your state</h3>
			<p class="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
				We have written up {coverageLabel()} states so far. Each one shows where to register for
				sales tax, how the DBA works there, and - if you decide to form an LLC - where that gets
				filed. City and county licences are not listed: there are too many, and a wrong link is
				worse than none.
			</p>

			<label class="mt-8 block max-w-md">
				<span class="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
					Search states
				</span>
				<input
					type="search"
					bind:value={query}
					placeholder="California, or CA"
					autocomplete="off"
					class="mt-2 w-full border border-dust bg-surface px-4 py-3 text-base text-iron
					       placeholder:text-granite"
				/>
			</label>
		</div>
	</Reveal>

	{#if filtered.length === 0}
		<p class="mt-10 text-[0.9375rem] leading-relaxed">
			No state matches "{query}". Check the spelling, or clear the box to see all of them.
		</p>
	{/if}

	{#if filteredDetailed.length > 0}
		<div class="mt-10 space-y-4">
			{#each filteredDetailed as state (state.code)}
				<details class="group border border-dust bg-surface">
					<summary
						class="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-base
						       text-iron marker:content-none [&::-webkit-details-marker]:hidden"
					>
						<span class="font-display">{state.name}</span>
						<span class="text-xs tracking-[0.14em] text-accent uppercase">
							<span class="group-open:hidden">Open</span>
							<span class="hidden group-open:inline">Close</span>
						</span>
					</summary>

					<div class="space-y-6 border-t border-dust px-5 pt-5 pb-6">
						{#if state.sellerPermit}
							<div>
								<h4 class="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
									Sales tax
								</h4>
								<p class="mt-2 text-[0.9375rem] leading-relaxed">
									Register with the
									<strong class="text-iron">{state.sellerPermit.agency}</strong>
									for a {state.sellerPermit.name}.
								</p>
								{#if state.sellerPermit.note}
									<p class="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
										{state.sellerPermit.note}
									</p>
								{/if}
								<a
									href={state.sellerPermit.registerUrl}
									rel="noopener"
									target="_blank"
									class="mt-2 inline-block text-[0.9375rem] text-accent underline underline-offset-4"
								>
									Register for sales tax
								</a>
							</div>
						{/if}

						{#if state.dba}
							<div>
								<h4 class="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
									Trading under another name
								</h4>
								<p class="mt-2 text-[0.9375rem] leading-relaxed">
									Filed with <strong class="text-iron">{state.dba.filedWith}</strong>.
								</p>
								{#if state.dba.note}
									<p class="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
										{state.dba.note}
									</p>
								{/if}
								{#if state.dba.lookupUrl}
									<a
										href={state.dba.lookupUrl}
										rel="noopener"
										target="_blank"
										class="mt-2 inline-block text-[0.9375rem] text-accent underline underline-offset-4"
									>
										Where to file
									</a>
								{/if}
							</div>
						{/if}

						{#if state.llcFiling}
							<div>
								<h4 class="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
									Only if you form an LLC
								</h4>
								<p class="mt-2 text-[0.9375rem] leading-relaxed">
									Filed with <strong class="text-iron">{state.llcFiling.agency}</strong>.
								</p>
								{#if state.llcFiling.note}
									<p class="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
										{state.llcFiling.note}
									</p>
								{/if}
								<div class="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
									<a
										href={state.llcFiling.nameSearchUrl}
										rel="noopener"
										target="_blank"
										class="text-accent underline underline-offset-4">Check a business name</a
									>
									<a
										href={state.llcFiling.fileUrl}
										rel="noopener"
										target="_blank"
										class="text-accent underline underline-offset-4">File your formation</a
									>
									{#if state.llcFiling.feeUrl}
										<a
											href={state.llcFiling.feeUrl}
											rel="noopener"
											target="_blank"
											class="text-accent underline underline-offset-4">Current fees</a
										>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</details>
			{/each}
		</div>
	{/if}

	{#if filteredGeneric.length > 0}
		<Reveal>
			<div class="mt-12">
				<h4 class="text-sm font-semibold tracking-[0.14em] text-charcoal uppercase">
					Not written up yet
				</h4>
				<p class="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
					Search for your state plus "department of revenue seller's permit" to register for
					sales tax, and your county plus "fictitious business name" for a DBA. Ask us if you
					get stuck.
				</p>
				<ul class="mt-5 flex flex-wrap gap-x-4 gap-y-2">
					{#each filteredGeneric as state (state.code)}
						<li class="text-[0.9375rem] text-charcoal">{state.name}</li>
					{/each}
				</ul>
			</div>
		</Reveal>
	{/if}

	<Reveal>
		<p class="mt-14 max-w-2xl border-t border-dust pt-8 text-sm leading-relaxed text-charcoal">
			We are not lawyers or accountants, and this is not legal or tax advice. It is the same
			explanation we would give a neighbour over the counter. For anything about your particular
			situation, talk to a professional in your state.
		</p>
	</Reveal>
</Section>

<!-- Questions -->
<Section tone="surface">
	<Reveal>
		<Eyebrow>FAQ</Eyebrow>
		<h2 class="max-w-2xl text-display leading-[1.05]">Common questions</h2>
	</Reveal>

	<dl class="mt-12 max-w-3xl">
		{#each faq as item, index (item.q)}
			<div class="border-t border-dust py-6">
				<dt class="font-display text-lg text-iron">{item.q}</dt>
				<dd class="mt-2 leading-relaxed">{item.a}</dd>
			</div>
		{/each}
	</dl>
</Section>

<!-- Close -->
<Section tone="iron" space="md">
	<Reveal>
		<div class="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
			<div>
				<h2 class="max-w-xl text-display leading-[1.05]">Start your shop</h2>
				<p class="mt-4 max-w-lg text-dust">
					Get your paperwork in order, fill out the form, put up a photo. We will take it from
					there.
				</p>
			</div>
			<div class="flex flex-wrap gap-3">
				{#if appLinks.vendorSignup}
					<Button href={appLinks.vendorSignup} variant="onDark" size="lg">
						Create your account
					</Button>
				{:else}
					<Button href={appLinks.web} variant="onDark" size="lg">Open the app</Button>
				{/if}
				<Button href="/sell" size="lg" class="border border-white/40 text-white hover:bg-white/10">
					What it costs
				</Button>
			</div>
		</div>
		<p class="mt-8 text-sm text-granite">
			Stuck on any of it? <a
				href="mailto:{contact.email}"
				class="text-thistle underline underline-offset-4">{contact.email}</a
			> - a person reads it.
		</p>
	</Reveal>
</Section>
