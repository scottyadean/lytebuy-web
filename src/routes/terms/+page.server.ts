import { loadLegalDocument } from '$lib/server/legal';

export const prerender = true;

export function load() {
	return loadLegalDocument('terms');
}
