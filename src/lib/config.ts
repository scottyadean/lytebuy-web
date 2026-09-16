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
	// Placeholders until the store listings are live. AppBadges renders a
	// "coming soon" state rather than a dead link when these are empty.
	ios: '',
	android: '',
	// The deployed Expo web client. This was 'http://localhost:3001' - a dev
	// placeholder that would have shipped every "Open the app" button on the
	// marketing site as a dead link pointing at the visitor's own machine.
	web: 'https://app.lytebuy.com',
	// Where a vendor lands to create their selling account: the client's own
	// /sell route (lytebuy-client/app/sell.tsx). Both urls verified live (200)
	// before being wired up here. While this was empty the /sell page fell back
	// to the contact form, hiding the primary vendor call to action.
	vendorSignup: 'https://app.lytebuy.com/sell'
} as const;

export const contact = {
	email: 'info@lytebuy.com',
	pressEmail: 'press@lytebuy.com',
	town: 'Lotus, California',
	timezone: "PST"
} as const;
