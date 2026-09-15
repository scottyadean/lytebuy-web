// The validation here is what stands between a person and a 422 they cannot
// read, and the honeypot branch is the one path that must NEVER reach the API.
// Both forms share this module, so a regression here breaks two pages at once.

import { describe, expect, it, vi } from 'vitest';

import {
	DEFAULT_COPY,
	INTERESTS,
	isInterest,
	readEnquiry,
	validateEnquiry,
	type EnquiryValues
} from './enquiry-form';

const valid: EnquiryValues = {
	name: 'Jo Baker',
	email: 'jo@example.com',
	business: "Jo's Bakery",
	interest: 'suggest',
	message: 'They do the best flowers on Main Street and are not on lytebuy yet.'
};

describe('isInterest', () => {
	it('accepts every option the forms offer', () => {
		for (const value of INTERESTS) {
			expect(isInterest(value)).toBe(true);
		}
	});

	it('accepts suggest, which the suggest-a-shop form posts', () => {
		expect(isInterest('suggest')).toBe(true);
	});

	it('rejects anything the backend enum would reject', () => {
		expect(isInterest('nonsense')).toBe(false);
		expect(isInterest('')).toBe(false);
		// Guards against a case-mismatch: the API expects the lowercase value.
		expect(isInterest('SUGGEST')).toBe(false);
	});
});

describe('validateEnquiry', () => {
	it('passes a good submission', () => {
		expect(validateEnquiry(valid)).toEqual({});
	});

	it('requires a name of at least two characters', () => {
		expect(validateEnquiry({ ...valid, name: 'J' }).name).toBe(DEFAULT_COPY.name);
	});

	it('rejects an address that is not shaped like an email', () => {
		for (const email of ['not-an-email', 'a@b', 'a b@c.com', '']) {
			expect(validateEnquiry({ ...valid, email }).email).toBe(DEFAULT_COPY.email);
		}
	});

	it('accepts ordinary addresses, including plus tags and subdomains', () => {
		for (const email of ['a+tag@example.co.uk', 'first.last@mail.example.com']) {
			expect(validateEnquiry({ ...valid, email }).email).toBeUndefined();
		}
	});

	it('requires a message of at least ten characters', () => {
		expect(validateEnquiry({ ...valid, message: 'too short' }).message).toBe(
			DEFAULT_COPY.messageShort
		);
	});

	it('rejects a message past the backend cap, so the API does not 422', () => {
		expect(validateEnquiry({ ...valid, message: 'x'.repeat(4001) }).message).toBe(
			DEFAULT_COPY.messageLong
		);
	});

	it('accepts a message exactly at the cap', () => {
		expect(validateEnquiry({ ...valid, message: 'x'.repeat(4000) }).message).toBeUndefined();
	});

	it('rejects an interest the backend does not know', () => {
		expect(validateEnquiry({ ...valid, interest: 'nonsense' }).interest).toBe(
			DEFAULT_COPY.interest
		);
	});

	it('treats a blank business as fine, since it is optional', () => {
		expect(validateEnquiry({ ...valid, business: '' })).toEqual({});
	});

	it('uses the caller-supplied wording, so each form reads in its own voice', () => {
		const copy = { ...DEFAULT_COPY, name: 'Who should we thank?' };
		expect(validateEnquiry({ ...valid, name: '' }, copy).name).toBe('Who should we thank?');
	});

	it('reports every bad field at once rather than one at a time', () => {
		const errors = validateEnquiry({ name: '', email: 'x', business: '', interest: 'x', message: '' });
		expect(Object.keys(errors).sort()).toEqual(['email', 'interest', 'message', 'name']);
	});
});

describe('readEnquiry', () => {
	const build = (entries: Record<string, string>) => {
		const form = new FormData();
		for (const [k, v] of Object.entries(entries)) form.append(k, v);
		return form;
	};

	it('pulls the five fields off the form', () => {
		const { values } = readEnquiry(
			build({
				name: 'Jo',
				email: 'jo@example.com',
				business: 'Bakery',
				interest: 'suggest',
				message: 'hello there'
			})
		);
		expect(values).toEqual({
			name: 'Jo',
			email: 'jo@example.com',
			business: 'Bakery',
			interest: 'suggest',
			message: 'hello there'
		});
	});

	it('trims whitespace, so " " does not pass as a name', () => {
		const { values } = readEnquiry(build({ name: '  Jo  ', email: ' jo@example.com ' }));
		expect(values.name).toBe('Jo');
		expect(values.email).toBe('jo@example.com');
	});

	it('defaults missing fields to empty strings rather than undefined', () => {
		const { values } = readEnquiry(build({}));
		expect(values).toEqual({ name: '', email: '', business: '', interest: '', message: '' });
	});

	it('surfaces the honeypot separately from the real fields', () => {
		const { honeypot } = readEnquiry(build({ website: 'http://spam.example' }));
		expect(honeypot).toBe('http://spam.example');
	});
});

describe('handleEnquiry', () => {
	// Imported lazily inside each test so the contact module can be mocked per
	// case without the mock leaking across the file.
	const load = async () => await import('./enquiry-form');

	it('never reaches the API when the honeypot is filled, but reports success', async () => {
		const submit = vi.fn();
		vi.doMock('./contact', () => ({ submitEnquiry: submit }));
		vi.resetModules();
		const { handleEnquiry } = await load();

		const form = new FormData();
		for (const [k, v] of Object.entries(valid)) form.append(k, v);
		form.append('website', 'http://spam.example');

		const result = await handleEnquiry(fetch, form, { label: 'test' });
		expect(result).toEqual({ success: true });
		expect(submit).not.toHaveBeenCalled();
		vi.doUnmock('./contact');
		vi.resetModules();
	});

	it('sends a blank business as null, not an empty string', async () => {
		const submit = vi.fn().mockResolvedValue(true);
		vi.doMock('./contact', () => ({ submitEnquiry: submit }));
		vi.resetModules();
		const { handleEnquiry } = await load();

		const form = new FormData();
		for (const [k, v] of Object.entries({ ...valid, business: '' })) form.append(k, v);

		await handleEnquiry(fetch, form, { label: 'test' });
		expect(submit).toHaveBeenCalledWith(fetch, expect.objectContaining({ business: null }));
		vi.doUnmock('./contact');
		vi.resetModules();
	});

	it('reports failure rather than success when the API is unreachable', async () => {
		const submit = vi.fn().mockResolvedValue(false);
		vi.doMock('./contact', () => ({ submitEnquiry: submit }));
		vi.resetModules();
		const { handleEnquiry } = await load();
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const form = new FormData();
		for (const [k, v] of Object.entries(valid)) form.append(k, v);

		const result = (await handleEnquiry(fetch, form, { label: 'test' })) as {
			status: number;
			data: { errors: Record<string, string> };
		};
		expect(result.status).toBe(502);
		expect(result.data.errors.form).toBeTruthy();
		// The log line is the only surviving copy, so it must actually happen.
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
		vi.doUnmock('./contact');
		vi.resetModules();
	});

	it('does not call the API at all when validation fails', async () => {
		const submit = vi.fn();
		vi.doMock('./contact', () => ({ submitEnquiry: submit }));
		vi.resetModules();
		const { handleEnquiry } = await load();

		const form = new FormData();
		form.append('name', 'J');

		const result = (await handleEnquiry(fetch, form, { label: 'test' })) as { status: number };
		expect(result.status).toBe(400);
		expect(submit).not.toHaveBeenCalled();
		vi.doUnmock('./contact');
		vi.resetModules();
	});
});
