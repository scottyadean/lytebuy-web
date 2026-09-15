/** Contact-form submission to the lytebuy backend (LB-6.7).
 *
 *  Deliberately a separate module from vendors.ts, which degrades to `null` on
 *  failure. That is right for a vendor count - a missing stat beats a 500 - but
 *  it is exactly WRONG here: silently swallowing a failed submission is the
 *  "lost on the floor" outcome this ticket exists to end. So this reports
 *  failure and the caller tells the person.
 */

import { env } from '$env/dynamic/private';

function baseUrl(): string {
	// Note LYTEBUY_API_URL already includes /api/v1 (unlike the admin app's
	// API_URL, which does not).
	return (env.LYTEBUY_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');
}

export type ContactEnquiry = {
	name: string;
	email: string;
	business: string | null;
	interest: string;
	message: string;
};

/** True if the enquiry was stored. False means the caller must NOT report
 *  success - the person needs to know to try another way. */
export async function submitEnquiry(
	fetcher: typeof fetch,
	enquiry: ContactEnquiry
): Promise<boolean> {
	try {
		const res = await fetcher(`${baseUrl()}/contact-enquiries`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(enquiry)
		});
		return res.ok;
	} catch {
		// Transport failure (API down, DNS, timeout). Not fatal to the request -
		// the caller falls back to logging and an honest error message.
		return false;
	}
}
