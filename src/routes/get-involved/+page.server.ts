import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const INTERESTS = ['sell', 'invest', 'press', 'other'] as const;
type Interest = (typeof INTERESTS)[number];

function isInterest(value: string): value is Interest {
	return (INTERESTS as readonly string[]).includes(value);
}

// Deliberately permissive: the goal is to catch typos, not to adjudicate the
// RFC. Anything shaped like a@b.c gets through and bounces later if it is wrong.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const business = String(form.get('business') ?? '').trim();
		const interestRaw = String(form.get('interest') ?? 'sell').trim();
		const message = String(form.get('message') ?? '').trim();
		// Bots fill every field they find; a human never sees this one.
		const honeypot = String(form.get('website') ?? '').trim();

		const values = { name, email, business, interest: interestRaw, message };
		const errors: Record<string, string> = {};

		if (name.length < 2) errors.name = 'Please tell us your name.';
		if (!EMAIL.test(email)) errors.email = 'That email address does not look right.';
		if (message.length < 10) errors.message = 'A sentence or two, so we can reply usefully.';
		if (message.length > 4000) errors.message = 'That is longer than we can take here.';
		if (!isInterest(interestRaw)) errors.interest = 'Pick one of the options.';

		if (Object.keys(errors).length) {
			return fail(400, { errors, values });
		}

		if (honeypot) {
			// Silently accept so the bot does not learn what tripped it, and never
			// deliver the message anywhere.
			return { success: true };
		}

		// No mail transport is wired up yet. Logging keeps submissions recoverable
		// from the container logs rather than dropping them on the floor, and this
		// is the single place to swap in SES/Postmark when the domain is verified.
		console.info('[get-involved] enquiry', {
			name,
			email,
			business: business || null,
			interest: interestRaw,
			message
		});

		return { success: true };
	}
};
