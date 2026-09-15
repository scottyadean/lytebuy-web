// The EIN window is the one piece of live logic on /help/start-a-business, and
// getting it wrong sends a founder to a closed IRS tool or lets them start an
// application they cannot finish. These pin the boundaries, including the
// daylight-saving switch, which an offset-based implementation would get wrong.

import { describe, expect, it } from 'vitest';

import {
	easternParts,
	einWindow,
	formatMinutes,
	isEinWeekday,
	minutesUntilEinClose
} from './ein';

/** A UTC instant, so each case states an unambiguous moment. */
const utc = (iso: string) => new Date(iso);

describe('easternParts', () => {
	it('converts a UTC instant to Eastern during standard time', () => {
		// 2026-01-14 is a Wednesday. 15:30 UTC is 10:30 EST (UTC-5).
		expect(easternParts(utc('2026-01-14T15:30:00Z'))).toEqual({
			weekday: 3,
			hour: 10,
			minute: 30
		});
	});

	it('converts during daylight saving, when the offset is an hour different', () => {
		// 2026-07-15 is a Wednesday. 15:30 UTC is 11:30 EDT (UTC-4).
		expect(easternParts(utc('2026-07-15T15:30:00Z'))).toEqual({
			weekday: 3,
			hour: 11,
			minute: 30
		});
	});

	it('reports midnight Eastern as hour 0, not 24', () => {
		// 2026-01-15 05:00 UTC is 2026-01-15 00:00 EST, a Thursday.
		expect(easternParts(utc('2026-01-15T05:00:00Z'))).toEqual({
			weekday: 4,
			hour: 0,
			minute: 0
		});
	});
});

describe('isEinWeekday', () => {
	it('accepts Monday through Friday', () => {
		expect([1, 2, 3, 4, 5].map(isEinWeekday)).toEqual([true, true, true, true, true]);
	});

	it('rejects Saturday and Sunday', () => {
		expect(isEinWeekday(6)).toBe(false);
		expect(isEinWeekday(0)).toBe(false);
	});
});

describe('minutesUntilEinClose', () => {
	it('counts down to the 22:00 cut-off', () => {
		expect(minutesUntilEinClose(21, 0)).toBe(60);
		expect(minutesUntilEinClose(21, 45)).toBe(15);
		expect(minutesUntilEinClose(7, 0)).toBe(900);
	});

	it('never goes negative once the cut-off has passed', () => {
		expect(minutesUntilEinClose(23, 30)).toBe(0);
	});
});

describe('formatMinutes', () => {
	it('renders hours and minutes together', () => {
		expect(formatMinutes(80)).toBe('1 hour 20 minutes');
		expect(formatMinutes(155)).toBe('2 hours 35 minutes');
	});

	it('drops the empty half of the pair', () => {
		expect(formatMinutes(120)).toBe('2 hours');
		expect(formatMinutes(45)).toBe('45 minutes');
	});

	it('singularises one minute', () => {
		expect(formatMinutes(1)).toBe('1 minute');
		expect(formatMinutes(60)).toBe('1 hour');
	});

	it('handles zero and negatives without producing an empty string', () => {
		expect(formatMinutes(0)).toBe('0 minutes');
		expect(formatMinutes(-10)).toBe('0 minutes');
	});
});

describe('einWindow', () => {
	it('is open mid-morning on a weekday', () => {
		// Wednesday 10:30 EST.
		const result = einWindow(utc('2026-01-14T15:30:00Z'));
		expect(result.open).toBe(true);
		expect(result.closingSoon).toBe(false);
		expect(result.minutesRemaining).toBe(690);
		expect(result.message).toContain('open now');
	});

	it('opens exactly at 7:00 a.m. Eastern', () => {
		// Wednesday 12:00 UTC is 07:00 EST.
		expect(einWindow(utc('2026-01-14T12:00:00Z')).open).toBe(true);
	});

	it('is still closed at 6:59 a.m. Eastern', () => {
		const result = einWindow(utc('2026-01-14T11:59:00Z'));
		expect(result.open).toBe(false);
		expect(result.message).toContain('opens at 7:00 a.m.');
	});

	it('is closed once 10:00 p.m. Eastern arrives', () => {
		// Wednesday 03:00 UTC Thursday is 22:00 EST Wednesday.
		const result = einWindow(utc('2026-01-15T03:00:00Z'));
		expect(result.open).toBe(false);
		expect(result.message).toContain('opens again tomorrow');
	});

	it('warns when there is not enough runway to finish in one sitting', () => {
		// Wednesday 21:45 EST - 15 minutes left, under the 30 minute threshold.
		const result = einWindow(utc('2026-01-15T02:45:00Z'));
		expect(result.open).toBe(true);
		expect(result.closingSoon).toBe(true);
		expect(result.message).toContain('does not save your progress');
	});

	it('is closed all weekend, even during business hours', () => {
		// 2026-01-17 is a Saturday; 15:00 UTC is 10:00 EST.
		const result = einWindow(utc('2026-01-17T15:00:00Z'));
		expect(result.open).toBe(false);
		expect(result.message).toContain('weekends');
	});
});
