import { DEFAULT_COPY, handleEnquiry } from '$lib/server/enquiry-form';
import type { Actions } from './$types';

// Same fields as /get-involved, worded for someone recommending a shop that is
// not theirs - "your name" is the suggester, "business" is the shop being
// suggested, so the default copy would be asking about the wrong party.
const COPY = {
	...DEFAULT_COPY,
	name: 'Please tell us your name, so we can say thank you.',
	messageShort: 'A sentence or two about the shop, so we know who to approach.',
	unavailable:
		'We could not take that just now. Please email info@lytebuy.com and we will pick it up.'
};

export const actions: Actions = {
	default: async ({ request, fetch }) =>
		handleEnquiry(fetch, await request.formData(), { label: 'suggest-a-shop', copy: COPY })
};
