import { handleEnquiry } from '$lib/server/enquiry-form';
import type { Actions } from './$types';

export const actions: Actions = {
	// Parsing, validation and submission are shared with /suggest-a-shop - see
	// $lib/server/enquiry-form. This page only names itself for the fallback log.
	default: async ({ request, fetch }) =>
		handleEnquiry(fetch, await request.formData(), { label: 'get-involved' })
};
