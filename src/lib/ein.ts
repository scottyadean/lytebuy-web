/**
 * EIN application helpers for /help/start-a-business.
 *
 * The IRS online EIN Assistant is not always open: it runs Monday to Friday,
 * 7:00 a.m. to 10:00 p.m. Eastern, and it does not save a partial application.
 * Someone who starts at 9:55 p.m. loses their work, so the page tells them
 * whether it is open right now and how long they have.
 *
 * All of the window arithmetic lives here and is called from the page. Nothing
 * computes a time on the page itself.
 */

export const IRS_EIN_ASSISTANT_URL =
	'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online';

/** Opening hour, Eastern, inclusive. */
export const EIN_OPEN_HOUR_ET = 7;
/** Closing hour, Eastern, exclusive - the tool stops accepting at 22:00. */
export const EIN_CLOSE_HOUR_ET = 22;

/** Minutes of runway below which we tell someone to come back tomorrow. */
export const EIN_SHORT_RUNWAY_MINUTES = 30;

export interface EinWindow {
	open: boolean;
	/** Minutes until close when open; 0 when closed. */
	minutesRemaining: number;
	/** Open, but with too little time to finish in one sitting. */
	closingSoon: boolean;
	/** Ready-to-render sentence about the window. */
	message: string;
}

/**
 * The wall-clock time in Eastern, as {day, hour, minute}.
 *
 * Uses Intl with an explicit America/New_York zone rather than an offset, so
 * daylight saving is handled by the platform instead of by us.
 */
export function easternParts(now: Date): { weekday: number; hour: number; minute: number } {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/New_York',
		weekday: 'short',
		hour: 'numeric',
		minute: 'numeric',
		hour12: false
	});

	const parts = formatter.formatToParts(now);
	const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	// hour12:false yields "24" for midnight in some engines; normalise to 0.
	const hour = Number(value('hour')) % 24;

	return {
		weekday: weekdays.indexOf(value('weekday')),
		hour,
		minute: Number(value('minute'))
	};
}

/** Monday to Friday. The tool is closed at weekends regardless of the hour. */
export function isEinWeekday(weekday: number): boolean {
	return weekday >= 1 && weekday <= 5;
}

/** Minutes from the given Eastern time until the 10 p.m. ET cut-off. */
export function minutesUntilEinClose(hour: number, minute: number): number {
	const remaining = (EIN_CLOSE_HOUR_ET - hour) * 60 - minute;
	return Math.max(0, remaining);
}

/** "1 hour 20 minutes", "45 minutes", "1 minute". */
export function formatMinutes(total: number): string {
	if (total <= 0) return '0 minutes';

	const hours = Math.floor(total / 60);
	const minutes = total % 60;
	const parts: string[] = [];

	if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
	if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);

	return parts.join(' ');
}

/**
 * Whether the IRS online application is open right now, and what to say.
 *
 * The message is the whole point: a closed tool with no explanation reads as a
 * broken link, and "you have 12 minutes" is the difference between finishing
 * and starting over.
 */
export function einWindow(now: Date): EinWindow {
	const { weekday, hour, minute } = easternParts(now);

	if (!isEinWeekday(weekday)) {
		return {
			open: false,
			minutesRemaining: 0,
			closingSoon: false,
			message:
				'The IRS online application is closed at weekends. It opens again Monday at 7:00 a.m. Eastern.'
		};
	}

	const withinHours = hour >= EIN_OPEN_HOUR_ET && hour < EIN_CLOSE_HOUR_ET;

	if (!withinHours) {
		return {
			open: false,
			minutesRemaining: 0,
			closingSoon: false,
			message:
				hour < EIN_OPEN_HOUR_ET
					? 'The IRS online application opens at 7:00 a.m. Eastern today.'
					: 'The IRS online application is closed for the day. It opens again tomorrow at 7:00 a.m. Eastern.'
		};
	}

	const minutesRemaining = minutesUntilEinClose(hour, minute);
	const closingSoon = minutesRemaining < EIN_SHORT_RUNWAY_MINUTES;

	return {
		open: true,
		minutesRemaining,
		closingSoon,
		message: closingSoon
			? `The IRS online application closes in ${formatMinutes(minutesRemaining)}. It does not save your progress, so it is worth starting fresh tomorrow morning.`
			: `The IRS online application is open now, with ${formatMinutes(minutesRemaining)} left today. It takes about fifteen minutes.`
	};
}
