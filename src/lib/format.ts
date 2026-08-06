/** Formatting helpers shared by server and client. */

/** "5 August 2026". Fixed locale so server and client render the same string
 *  and hydration does not warn about a mismatch. */
export function formatDate(iso: string | null | undefined): string {
	if (!iso) return '';
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(date);
}

/** ISO date only, for <time datetime> and structured data. */
export function isoDate(iso: string | null | undefined): string {
	if (!iso) return '';
	const date = new Date(iso);
	return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

/** Rough read time from a markdown body. 200 wpm, rounded up so a very short
 *  post never reads "0 min". */
export function readingMinutes(markdown: string | null | undefined): number {
	if (!markdown) return 1;
	return Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 200));
}
