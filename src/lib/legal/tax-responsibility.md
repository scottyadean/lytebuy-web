# Lytebuy Tax Responsibility

> **DRAFT — not legal or tax advice.** This is the plain-language, user-facing summary
> of how tax works on Lytebuy. It reflects the implemented model (see the engineering
> authority **docs/TAX.md**). The marketplace-facilitator determination and the list
> of states to register in **must be confirmed by a CPA or tax service before real
> money moves.** Fill the **[bracketed]** placeholders.

**Effective date:** November 11, 2026 · **Last updated:** November 11, 2026

This document explains who is responsible for which taxes on Lytebuy. It covers
**sales tax** (on purchases) and **income tax** (on Vendor earnings).

## Sales tax — Lytebuy handles it

**Lytebuy is a marketplace facilitator.** For sales made through the marketplace,
Lytebuy — not the individual Vendor — is responsible for **calculating, collecting,
and remitting sales tax** to the state, where it has an obligation to do so.

What this means in practice:

- **Buyers:** the sales tax you owe is calculated at checkout based on your
  destination and shown as a separate line in your itemized total. You pay it once,
  to Lytebuy, at purchase.
- **Vendors:** you do **not** collect or remit sales tax on your Lytebuy sales, and
  sales tax is **never** included in your payout. Lytebuy holds the collected tax and
  remits it. A "vendors are responsible for tax" disclaimer would not be legally
  valid for on-platform sales — this is a duty owed to the state by the facilitator.
- **Refunds:** when an order is refunded, the sales tax collected on it is reversed
  along with the refund.

### How the tax amount is determined

- Tax is sourced to the **buyer's location** (destination-based), using a
  state-level rate table. *(Current implementation uses state-level base rates; it
  does not yet add county/city/district rates, which can slightly under-collect in
  some ZIP codes — a known limitation to revisit with a full tax service. See
  docs/TAX.md.)*
- **No-sales-tax states** (e.g. Alaska, Delaware, Montana, New Hampshire, Oregon at
  the state level) are charged **\$0**.
- Tax is applied to the taxable portion of the order (goods and, where applicable, the
  buyer service fee); shipping treatment follows the applicable state's rules.

### Where Lytebuy collects

Lytebuy collects sales tax in states where it has a legal obligation ("nexus"). Until
Lytebuy is registered and enabled in a given state, tax for that state may show as
**\$0**. The set of states where tax is collected will expand as Lytebuy registers.
**[List the currently-registered states here once confirmed with a CPA.]**

## Income tax — the Vendor's responsibility

Sales tax and income tax are different things.

- **Vendors** are responsible for reporting and paying **income tax** on the money
  they earn from sales, according to their own tax situation. Lytebuy does not pay a
  Vendor's income tax.
- Where required by law, Lytebuy or its payment provider (Stripe) will issue the
  appropriate year-end tax forms (for example, a **1099-K**) based on payout activity.
- Lytebuy collects the information needed to issue those forms during Vendor
  onboarding / payout setup.

## Buyers outside the marketplace

If a Vendor sells to you **outside** of Lytebuy (their own website, in person off the
platform, etc.), that sale is **not** a Lytebuy marketplace sale, and Lytebuy is not
the facilitator for it. The Vendor is responsible for tax on their genuinely
off-platform sales.

## Summary table

| Tax | Who calculates | Who collects | Who remits | Shown to buyer? |
|-----|----------------|--------------|-----------|-----------------|
| **Sales tax (on-platform sale)** | Lytebuy | Lytebuy (from buyer) | Lytebuy | Yes — separate line at checkout |
| **Income tax (Vendor earnings)** | Vendor | Vendor | Vendor | N/A |

## Questions

Tax questions about your account: **info@lytebuy.com**. For advice about your own tax
situation, please consult a qualified tax professional — Lytebuy cannot give tax
advice.

---

*Engineering authority: **docs/TAX.md** (facilitator model, ducttape rate table,
tax excluded from `ledger.vendor_net`, reversal on refund). Requirements background:
docs/tax-compliance-requirements.md, docs/tax-research.md. Go-live gate: confirm
facilitator status + registration states with a CPA, then enable tax collection
(`TAX_ENGINE_ENABLED`) in production.*
