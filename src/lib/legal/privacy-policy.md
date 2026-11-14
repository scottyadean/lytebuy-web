# Lytebuy Privacy Policy

> **DRAFT — not legal advice.** Written to reflect the data the app actually collects
> and how it is used (verified against the codebase). It MUST be reviewed by a
> licensed attorney before publishing, and reconciled with the app's in-product
> privacy commitments (served at `GET /api/v1/privacy`) and iOS `PrivacyInfo.xcprivacy`
> / Play Data Safety declarations. Fill the **[bracketed]** placeholders.

**Effective date:** November 11, 2026 · **Last updated:** November 11, 2026

This Privacy Policy explains how **Scott Dean** ("Lytebuy", "we") collects,
uses, and shares information when you use the Lytebuy marketplace ("Service").

## Our commitments

These are enforced in the product (see `GET /api/v1/privacy`):

- **We do not sell or share your personal data.**
- **We do not use third-party advertising trackers.**
- **We collect the minimum personal data needed to operate the marketplace.**

## 1. Information we collect

**You give us:**

- **Account:** email address, name, password (stored only as a salted hash — we never
  store your plaintext password), and optionally a phone number and avatar image.
- **Addresses:** shipping/redemption addresses you save or enter at checkout.
- **Vendor onboarding (Vendors only):** business name and details needed to create a
  store and a payout account.
- **Content:** product listings, photos, videos, reviews, and messages you send other
  users.

**Created as you use the Service:**

- **Orders:** what you bought, from whom, order totals, tax, and fulfillment status.
- **Account activity:** last-login time and similar operational records.
- **Consent settings:** whether you have opted into marketing.

**Payment data:** Payments are processed by **Stripe**. **We do not store your full
card number.** We keep only a Stripe reference (a customer/charge identifier) needed
to process payments, refunds, and payouts. Stripe handles card data under its own
privacy policy and PCI compliance.

**Location:** If you allow it, the app uses your device location to show nearby shops
and products on the map. You can decline; the map degrades gracefully. We do not
track your location in the background.

## 2. How we use information

- To create and operate your account and process orders, payments, refunds, and
  payouts.
- To calculate and remit sales tax (as a marketplace facilitator — see the
  [Tax Responsibility](tax-responsibility.md) document).
- To provide core features: search, the map, messaging between buyers and vendors,
  reviews, likes, the cart, and order history.
- To send **transactional** communications (order confirmations, receipts, security
  notices) — these are required to run the Service and are not marketing.
- For **marketing** communications, only if you have opted in.
- To detect fraud and abuse, and to comply with legal obligations.

## 3. How we share information

We share personal data only as needed to run the marketplace:

- **With Vendors** you buy from: the information needed to fulfill your order (e.g.
  name and shipping address). Vendors are independent and responsible for their own
  handling of that data.
- **With service providers** that operate the Service on our behalf, under contract:
  our **payment processor (Stripe)**, cloud hosting and object storage, mapping/
  geocoding, and analytics.
- **For legal reasons:** to comply with law, enforce our Terms, or protect rights and
  safety.
- **In a business transfer:** if Lytebuy is acquired or merged, subject to this
  Policy.

**We do not sell your personal data and we do not share it with third-party
advertising networks.**

## 4. Your choices and rights

- **Consent:** turn marketing communications on or off at any time.
- **Access / correction:** view and update your account information in the app.
- **Deletion:** you may request deletion of your account and associated personal data,
  subject to records we must retain for legal, tax, and accounting purposes (e.g.
  transaction and tax records).
- **Location and notifications:** control these through your device settings.
- Depending on where you live (e.g. California/CCPA, EU/UK GDPR), you may have
  additional rights to access, port, or delete your data, and to object to certain
  processing. To exercise any right, contact **info@lytebuy.com**. *(Confirm the exact
  rights, response timelines, and any "authorized agent" handling with counsel.)*

## 5. Data retention

We keep personal data for as long as your account is active and as needed to provide
the Service. We retain **transaction, payout, and tax records** for the periods
required by law even after account deletion.

## 6. Security

We protect data with encryption in transit, hashed passwords, scoped access to
storage, and short-lived signed links for private files (e.g. digital downloads). No
system is perfectly secure, but we work to protect your information.

## 7. Children

The Service is not directed to children under 13 (or the minimum age in your region),
and we do not knowingly collect their personal data.

## 8. International users

The Service is operated from the **United States**. If you use it from elsewhere,
you consent to processing in the United States. *(Add transfer-mechanism language if
you serve EU/UK users.)*

## 9. Changes

We may update this Policy; material changes will be communicated in the app or by
email.

## 10. Contact

Privacy questions or requests: **info@lytebuy.com** · **100 N Gilbert Rd #202, Gilbert, AZ 85234**

---

*Keep this consistent with: the in-product commitments (`app/api/v1/endpoints/privacy.py`),
the account/consent data model (`app/models/user.py` — email, hashed password, name,
optional phone, avatar, `stripe_customer_id`, `analytics_consent`, `marketing_consent`),
the iOS `PrivacyInfo.xcprivacy` manifest, and the Play Store Data Safety form.*
