<script lang="ts">
	import { contact, site } from '$lib/config';
	import AppBadges from './AppBadges.svelte';
	import Logo from './Logo.svelte';

	const columns = [
		{
			title: 'Lytebuy',
			links: [
				{ href: '/who-we-are', label: 'Who we are' },
				{ href: '/our-vision', label: 'Our vision' },
				{ href: '/blog', label: 'Blog' },
				{ href: '/press', label: 'Press' },
				{ href: '/investors', label: 'Investors' }
			]
		},
		{
			title: 'For vendors',
			links: [
				{ href: '/sell', label: 'Start selling' },
				{ href: '/sell#how-you-get-paid', label: 'How you get paid' },
				{ href: '/get-involved#contact', label: 'Talk to us' }
			]
		},
		{
			title: 'For shoppers',
			links: [
				{ href: '/get-the-app', label: 'Get the app' },
				{ href: '/lyte-bearer', label: 'Lyte-Bearer Affiliate' },
				{ href: '/#vendors', label: 'Browse vendors' },
				{ href: '/#mission', label: 'Our mission' }
			]
		}
	];

	const year = new Date().getFullYear();
</script>

<footer class="bg-iron text-dust">
	<div class="container-page py-16 md:py-20">
		<div class="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
			<div>
				<Logo onDark />
				<p class="mt-5 max-w-xs text-sm leading-relaxed text-granite">
					{site.blurb}
				</p>
				<AppBadges onDark class="mt-6" />
			</div>

			{#each columns as column (column.title)}
				<div>
					<h3 class="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
						{column.title}
					</h3>
					<ul class="space-y-2.5">
						{#each column.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-sm text-dust transition-colors hover:text-thistle"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div
			class="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-granite
			       md:flex-row md:items-center md:justify-between"
		>
			<p>&copy; {year} {site.name}. Built in {contact.town}.</p>
			<div class="flex flex-wrap gap-x-6 gap-y-2">
				<a href="mailto:{contact.email}" class="transition-colors hover:text-thistle">
					{contact.email}
				</a>
				<a href="/privacy" class="transition-colors hover:text-thistle">Privacy</a>
				<a href="/terms" class="transition-colors hover:text-thistle">Terms</a>
			</div>
		</div>
	</div>
</footer>
