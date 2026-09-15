/** The people behind Lytebuy, rendered by /team. Kept here rather than inline in
 *  the page so the roster is one list to edit and can be reused - the footer
 *  count, an about blurb, or a future card on /who-we-are all read from this. */

export interface TeamMember {
	/** URL fragment, so a member can be linked to directly: /team#scott-dean. */
	slug: string;
	name: string;
	/** Current title at Lytebuy. */
	role: string;
	/** Roles held elsewhere, shown under the Lytebuy one. */
	alsoRole?: string;
	photo: string;
	photoAlt: string;
	/** Prose, one string. Blank lines separate paragraphs - see toParagraphs. */
	bio: string;
	/** Companies worked with, listed as a credit line. */
	priorWork?: string[];
	qoute?: string;
	location?: string;
}

export const team: TeamMember[] = [
	{
		slug: 'scott-dean',
		name: 'Scott Dean',
		role: 'CEO, Lytebuy',
		alsoRole: 'CTO, Native American Tours',
		photo: '/img/team-scott-dean.jpg',
		photoAlt: 'Portrait of Scott Dean',
		bio: `Scott grew up in Lotus, a small town on the South Fork of the American River, where he spent his younger years working as a raft guide. He studied computer science and web development, then moved to San Francisco to build software. He has been at it ever since, and he is still learning.

He has been lucky to work with great teams at Groupon, MyPoints, Travelocity, Marketing Evolution, and Clear Capital, Native American Tours, Lagunacreek, along with many other projects.

He lives in Northern California for the time being, with his beautiful wife and his four phenomenal children.`,
		location: 'Northern California',
		qoute: `Every purchase is a vote for the kind of economy we want.`

	}
];

/** Splits a bio into paragraphs on blank lines, so the copy stays readable in
 *  the source file instead of being pre-chopped into an array of strings.
 *  Tolerates \r\n, trailing whitespace and runs of more than one blank line. */
export function toParagraphs(bio: string): string[] {
	return bio
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
		.filter((paragraph) => paragraph.length > 0);
}

/** Looked up by slug for a future per-member page, and by the page to resolve a
 *  #hash link. Returns undefined rather than throwing so a stale link is a
 *  missing card, not a 500. */
export function findMember(slug: string): TeamMember | undefined {
	return team.find((member) => member.slug === slug);
}
