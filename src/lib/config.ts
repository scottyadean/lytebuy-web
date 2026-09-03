/** Site-wide constants. Copy that appears in more than one place lives here so
 *  the tagline never drifts between the hero, the footer and the OG tags. */

export const site = {
	name: 'Lytebuy',
	tagline: 'Main street in your pocket.',
	blurb: 'Do good, make friends, eat good food, share stories, share love, repeat.',
	description:
		'Lytebuy is a no-cost digital marketplace where small businesses showcase what they are famous for, and neighbours find the good stuff a few streets away.',
	// Overridden by PUBLIC_SITE_URL at build time; this is the fallback used for
	// canonical URLs and the sitemap.
	url: 'https://lytebuy.com',
	locale: 'en_US',
	twitter: '@lytebuy'
} as const;

export const nav = [
	// The entry point for anyone who wants to help their own main street - it
	// forks to the vendor and lyte bearer paths (LB-WEB-11). First in the list
	// because it is the one action the site is actually asking for.
	{ href: '/promote-your-town', label: 'Promote your town' },
	{ href: '/who-we-are', label: 'Who we are' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/press', label: 'Press' },
	{ href: '/get-the-app', label: 'Get the app' },
	{ href: '/get-involved', label: 'Get involved' }
] as const;

export const appLinks = {
	// Placeholders until the listings are live. AppBadges renders a "coming
	// soon" state rather than a dead link when these are empty.
	ios: '',
	android: '',
	web: 'http://localhost:3001',
	// Where a vendor lands to create their selling account. Still to be
	// decided; while it is empty the /sell page points people at the app and
	// the contact form instead of rendering a dead button.
	vendorSignup: ''
} as const;

export const contact = {
	email: 'info@lytebuy.com',
	pressEmail: 'press@lytebuy.com',
	town: 'Lotus, California',
	timezone: "PST"
} as const;
