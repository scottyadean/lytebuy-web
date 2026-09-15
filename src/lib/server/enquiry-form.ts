/** Shared handling for the two public enquiry forms: /get-involved and
 *  /suggest-a-shop.
 *
 *  Both collect the same five fields and post to the same endpoint, differing
 *  only in wording and in which `interest` they default to. Keeping the parse,
 *  validation and submit in one place means a fix to any of them - a stricter
 *  email rule, a new length cap - lands on both forms at once, rather than
 *  being fixed on one and forgotten on the other.
 */

import { fail } from '@sveltejs/kit';
import { submitEnquiry } from '$lib/server/contact';

/** Mirrors ContactInterest in the backend. A value absent from this list is
 *  rejected there with a 422, so the two must be kept in step. */
export const INTERESTS = ['sell', 'invest', 'press', 'suggest', 'other'] as const;
export type Interest = (typeof INTERESTS)[number];

export function isInterest(value: string): value is Interest {
	return (INTERESTS as readonly string[]).includes(value);
}

// Deliberately permissive: the goal is to catch typos, not to adjudicate the
// RFC. Anything shaped like a@b.c gets through and bounces later if it is wrong.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The limits the backend enforces (see ContactEnquiryCreate). Duplicated here
 *  so the person gets a message in the form instead of a 422 they cannot read. */
export const LIMITS = {
	nameMin: 2,
	messageMin: 10,
	messageMax: 4000
} as const;

export type EnquiryValues = {
	name: string;
	email: string;
	business: string;
	interest: string;
	message: string;
};

export type EnquiryCopy = {
	/** Wording for each field's validation failure, so a shop suggestion does
	 *  not ask the suggester to describe their own business. */
	name: string;
	email: string;
	messageShort: string;
	messageLong: string;
	interest: string;
	/** Shown when the API could not be reached at all. */
	unavailable: string;
};

export const DEFAULT_COPY: EnquiryCopy = {
	name: 'Please tell us your name.',
	email: 'That email address does not look right.',
	messageShort: 'A sentence or two, so we can reply usefully.',
	messageLong: 'That is longer than we can take here.',
	interest: 'Pick one of the options.',
	unavailable:
		'We could not take that just now. Please email info@lytebuy.com and we will pick it up.'
};

/** Pulls the five fields plus the honeypot off a submitted form. */
export function readEnquiry(form: FormData): { values: EnquiryValues; honeypot: string } {
	const read = (key: string) => String(form.get(key) ?? '').trim();
	return {
		values: {
			name: read('name'),
			email: read('email'),
			business: read('business'),
			interest: read('interest'),
			message: read('message')
		},
		// Bots fill every field they find; a human never sees this one.
		honeypot: read('website')
	};
}

/** Field-level errors, keyed to match the form's input names. Empty means the
 *  submission is good enough to send on. */
export function validateEnquiry(
	values: EnquiryValues,
	copy: EnquiryCopy = DEFAULT_COPY
): Record<string, string> {
	const errors: Record<string, string> = {};

	if (values.name.length < LIMITS.nameMin) errors.name = copy.name;
	if (!EMAIL.test(values.email)) errors.email = copy.email;
	if (values.message.length < LIMITS.messageMin) errors.message = copy.messageShort;
	else if (values.message.length > LIMITS.messageMax) errors.message = copy.messageLong;
	if (!isInterest(values.interest)) errors.interest = copy.interest;

	return errors;
}

/** Validate, then submit. Returns either a SvelteKit `fail` or `{success}`, so
 *  both form actions stay a single call.
 *
 *  `label` only names the form in the fallback log line, so an operator reading
 *  container logs can tell a lost shop suggestion from a lost sales enquiry. */
export async function handleEnquiry(
	fetcher: typeof fetch,
	form: FormData,
	options: { label: string; copy?: EnquiryCopy }
) {
	const copy = options.copy ?? DEFAULT_COPY;
	const { values, honeypot } = readEnquiry(form);
	const errors = validateEnquiry(values, copy);

	if (Object.keys(errors).length) {
		return fail(400, { errors, values });
	}

	if (honeypot) {
		// Silently accept so the bot does not learn what tripped it, and never
		// deliver the message anywhere.
		return { success: true as const };
	}

	const stored = await submitEnquiry(fetcher, {
		name: values.name,
		email: values.email,
		business: values.business || null,
		interest: values.interest,
		message: values.message
	});

	if (!stored) {
		// Do NOT report success we did not achieve. The log line is the only
		// surviving copy if the API is down, so it stays as a fallback - and the
		// person is told to use email instead, with everything they typed kept.
		console.error(`[${options.label}] enquiry NOT stored, API unreachable`, {
			...values,
			business: values.business || null
		});
		return fail(502, { errors: { form: copy.unavailable }, values });
	}

	return { success: true as const };
}
