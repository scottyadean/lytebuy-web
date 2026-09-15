/**
 * Business registration data and lookups for /help/start-a-business.
 *
 * The page this feeds used to route everyone to the Secretary of State, which
 * is wrong for most Lytebuy vendors. A sole proprietor - the jam maker, the
 * woodworker - files NOTHING with the state to exist. They can just sell. What
 * they actually run into is a different, mostly LOCAL set of paperwork:
 *
 *  1. A DBA / fictitious business name, filed at the COUNTY level in most
 *     states (and in California also published in a local newspaper). There is
 *     no usable statewide API or index for this, so we link the county lookup
 *     where one exists and otherwise tell people what to search for.
 *  2. A seller's permit / sales tax registration, which goes to the state
 *     REVENUE department - a different agency from the Secretary of State.
 *     This is the one piece that is reliably state-level, so it is recorded
 *     here per state.
 *  3. A city or county business license. Thousands of jurisdictions; not
 *     enumerable. Explained, never faked.
 *  4. Cottage food permits for anything edible, handled by the COUNTY health
 *     department and varying wildly even inside one state.
 *
 * So `llcFiling` below is deliberately named for what it is: the path you need
 * only if you choose to form an LLC. It is not the default path.
 *
 * Deliberately NOT recorded here: filing fees and processing times. They change
 * without notice, and a stale fee on a help page is worse than no fee at all -
 * it is a number a founder budgets against. Each entry links to the agency's
 * own fee page instead.
 *
 * To promote a state from generic to detailed, add its blocks below. Nothing
 * else needs to change; the page reads whatever is here.
 */

/**
 * The LLC formation path. Only relevant if someone CHOOSES to form an LLC - a
 * sole proprietor never touches this agency.
 */
export interface LlcFiling {
	/** The agency that receives the formation document, in its own words. */
	agency: string;
	/** Online filing portal - where you actually submit. */
	fileUrl: string;
	/** Business/entity name search, to check the name is free before filing. */
	nameSearchUrl: string;
	/** The state's own fee page. Linked rather than transcribed, see above. */
	feeUrl?: string;
	/**
	 * Anything about this state that surprises people. Kept to genuine
	 * gotchas - an empty note is better than filler.
	 */
	note?: string;
}

/**
 * Sales tax registration - the seller's permit. A different agency from the
 * Secretary of State, and the piece that actually applies to almost every
 * vendor who sells taxable goods, whatever structure they chose.
 */
export interface SellerPermit {
	/** The revenue/tax agency, in its own words. */
	agency: string;
	/** Where to register. */
	registerUrl: string;
	/** What this state calls the thing, e.g. "seller's permit". */
	name: string;
	note?: string;
}

/**
 * Where the DBA (fictitious business name) is filed. Almost always COUNTY
 * level, so this carries guidance and a lookup rather than a single portal.
 */
export interface DbaFiling {
	/** "county clerk", "county recorder" - who takes it in this state. */
	filedWith: string;
	/** A statewide index or county-locator page, where one exists. */
	lookupUrl?: string;
	note?: string;
}

export interface StateInfo {
	/** USPS code, uppercase. The stable key. */
	code: string;
	name: string;
	/** Only needed if forming an LLC. Absent means we have not written it up. */
	llcFiling?: LlcFiling;
	/** Sales tax registration for this state. */
	sellerPermit?: SellerPermit;
	/** How the DBA works here. */
	dba?: DbaFiling;
}

/**
 * The 50 states plus DC. Order is alphabetical by name so the rendered list
 * needs no sorting pass.
 *
 * Seeded detail: California (home state - Lotus, CA), and the four states that
 * account for most first-time LLC formations. Add more as we get vendors there.
 */
export const STATES: StateInfo[] = [
	{ code: 'AL', name: 'Alabama' },
	{ code: 'AK', name: 'Alaska' },
	{
		code: 'AZ',
		name: 'Arizona',
		llcFiling: {
			agency: 'Arizona Corporation Commission',
			fileUrl: 'https://ecorp.azcc.gov/',
			nameSearchUrl: 'https://ecorp.azcc.gov/EntitySearch/Index',
			feeUrl: 'https://azcc.gov/corporations/fee-schedule',
			note: 'Arizona also requires a newspaper publication notice after your LLC is approved, unless you formed in Maricopa or Pima county.'
		}
,
		sellerPermit: {
			agency: 'Arizona Department of Revenue',
			registerUrl: 'https://azdor.gov/transaction-privilege-tax/tpt-license',
			name: 'Transaction Privilege Tax (TPT) license',
			note: 'Arizona calls its sales tax a Transaction Privilege Tax. Many cities levy their own on top, and the state collects those too.'
		},
		dba: {
			filedWith: 'Arizona Secretary of State (trade name), which is optional here',
			lookupUrl: 'https://azsos.gov/business/trade-names-and-trademarks',
			note: 'Arizona trade name registration is optional, not required.'
		}
	},
	{ code: 'AR', name: 'Arkansas' },
	{
		code: 'CA',
		name: 'California',
		llcFiling: {
			agency: 'California Secretary of State',
			fileUrl: 'https://bizfileonline.sos.ca.gov/',
			nameSearchUrl: 'https://bizfileonline.sos.ca.gov/search/business',
			feeUrl: 'https://www.sos.ca.gov/business-programs/business-entities/fees',
			note: 'California charges an annual minimum franchise tax on LLCs through the Franchise Tax Board, separate from the filing fee. You also file a Statement of Information within 90 days of forming.'
		}
,
		sellerPermit: {
			agency: 'California Department of Tax and Fee Administration (CDTFA)',
			registerUrl: 'https://onlineservices.cdtfa.ca.gov/',
			name: "seller's permit",
			note: 'Free to register. Required before you sell taxable goods, whatever structure you chose.'
		},
		dba: {
			filedWith: 'your county clerk',
			note: 'California also requires you to publish the fictitious business name in a local newspaper for four weeks, then file proof. Each county runs its own process.'
		}
	},
	{ code: 'CO', name: 'Colorado' },
	{ code: 'CT', name: 'Connecticut' },
	{ code: 'DE', name: 'Delaware' },
	{ code: 'DC', name: 'District of Columbia' },
	{
		code: 'FL',
		name: 'Florida',
		llcFiling: {
			agency: 'Florida Division of Corporations (Sunbiz)',
			fileUrl: 'https://efile.sunbiz.org/',
			nameSearchUrl: 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByName',
			feeUrl: 'https://dos.fl.gov/sunbiz/fees/',
			note: 'Florida requires an annual report every year between January 1 and May 1. Missing it carries a large late fee that the state does not waive.'
		}
,
		sellerPermit: {
			agency: 'Florida Department of Revenue',
			registerUrl: 'https://floridarevenue.com/taxes/registration',
			name: 'sales and use tax certificate'
		},
		dba: {
			filedWith: 'the Florida Division of Corporations',
			lookupUrl: 'https://dos.fl.gov/sunbiz/manage-business/fictitious-name/',
			note: 'Florida is one of the few states where the DBA is filed with the state rather than the county, and it must also be advertised in a local newspaper once.'
		}
	},
	{ code: 'GA', name: 'Georgia' },
	{ code: 'HI', name: 'Hawaii' },
	{ code: 'ID', name: 'Idaho' },
	{ code: 'IL', name: 'Illinois' },
	{ code: 'IN', name: 'Indiana' },
	{ code: 'IA', name: 'Iowa' },
	{ code: 'KS', name: 'Kansas' },
	{ code: 'KY', name: 'Kentucky' },
	{ code: 'LA', name: 'Louisiana' },
	{ code: 'ME', name: 'Maine' },
	{ code: 'MD', name: 'Maryland' },
	{ code: 'MA', name: 'Massachusetts' },
	{ code: 'MI', name: 'Michigan' },
	{ code: 'MN', name: 'Minnesota' },
	{ code: 'MS', name: 'Mississippi' },
	{ code: 'MO', name: 'Missouri' },
	{ code: 'MT', name: 'Montana' },
	{ code: 'NE', name: 'Nebraska' },
	{ code: 'NV', name: 'Nevada' },
	{ code: 'NH', name: 'New Hampshire' },
	{ code: 'NJ', name: 'New Jersey' },
	{ code: 'NM', name: 'New Mexico' },
	{
		code: 'NY',
		name: 'New York',
		llcFiling: {
			agency: 'New York Department of State, Division of Corporations',
			fileUrl: 'https://dos.ny.gov/limited-liability-company',
			nameSearchUrl: 'https://apps.dos.ny.gov/publicInquiry/',
			feeUrl: 'https://dos.ny.gov/limited-liability-company',
			note: 'New York requires you to publish notice of your LLC in two newspapers for six weeks and then file a Certificate of Publication. Budget for it - in some counties it costs more than the filing itself.'
		}
,
		sellerPermit: {
			agency: 'New York Department of Taxation and Finance',
			registerUrl: 'https://www.tax.ny.gov/bus/st/register.htm',
			name: 'Certificate of Authority',
			note: 'You must have this before you make your first taxable sale.'
		},
		dba: {
			filedWith: 'your county clerk (for a sole proprietor or partnership)',
			note: 'In New York City, file with the County Clerk for your borough.'
		}
	},
	{ code: 'NC', name: 'North Carolina' },
	{ code: 'ND', name: 'North Dakota' },
	{ code: 'OH', name: 'Ohio' },
	{ code: 'OK', name: 'Oklahoma' },
	{ code: 'OR', name: 'Oregon' },
	{ code: 'PA', name: 'Pennsylvania' },
	{ code: 'RI', name: 'Rhode Island' },
	{ code: 'SC', name: 'South Carolina' },
	{ code: 'SD', name: 'South Dakota' },
	{ code: 'TN', name: 'Tennessee' },
	{
		code: 'TX',
		name: 'Texas',
		llcFiling: {
			agency: 'Texas Secretary of State',
			fileUrl: 'https://direct.sos.state.tx.us/',
			nameSearchUrl: 'https://mycpa.cpa.state.tx.us/coa/',
			feeUrl: 'https://www.sos.state.tx.us/corp/formationfees.shtml',
			note: 'Texas has no state income tax, but LLCs file an annual franchise tax report with the Comptroller even when no tax is owed.'
		}
,
		sellerPermit: {
			agency: 'Texas Comptroller of Public Accounts',
			registerUrl: 'https://comptroller.texas.gov/taxes/permit/',
			name: "sales and use tax permit",
			note: 'Free to register.'
		},
		dba: {
			filedWith: 'your county clerk (assumed name certificate)',
			note: 'Texas calls the DBA an assumed name certificate. Sole proprietors file at the county; LLCs file with the state.'
		}
	},
	{ code: 'UT', name: 'Utah' },
	{ code: 'VT', name: 'Vermont' },
	{ code: 'VA', name: 'Virginia' },
	{
		code: 'WA',
		name: 'Washington',
		llcFiling: {
			agency: 'Washington Secretary of State',
			fileUrl: 'https://ccfs.sos.wa.gov/',
			nameSearchUrl: 'https://ccfs.sos.wa.gov/#/BusinessSearch',
			feeUrl: 'https://www.sos.wa.gov/corporations-charities/fees',
			note: 'After forming, register with the Department of Revenue for a Business License (UBI) number before you sell.'
		}
,
		sellerPermit: {
			agency: 'Washington Department of Revenue',
			registerUrl: 'https://dor.wa.gov/open-business/apply-business-license',
			name: 'Business License (UBI number)',
			note: 'Washington combines the state business license and tax registration into one application, and many city licenses are issued through the same form.'
		},
		dba: {
			filedWith: 'the Department of Revenue, as a trade name on your business licence application'
		}
	},
	{ code: 'WV', name: 'West Virginia' },
	{ code: 'WI', name: 'Wisconsin' },
	{ code: 'WY', name: 'Wyoming' }
];

/**
 * A state we have written up. Keyed on the seller's permit rather than the LLC
 * filing: the permit is the piece that applies to nearly every vendor, while
 * the LLC path is optional. A state with only an LLC block is not much use.
 */
export function hasDetailedGuidance(state: StateInfo): boolean {
	return state.sellerPermit !== undefined;
}

/** Only the states with a verified filing block, in list order. */
export function detailedStates(states: StateInfo[] = STATES): StateInfo[] {
	return states.filter(hasDetailedGuidance);
}

/** The remainder, which get the generic path. */
export function genericStates(states: StateInfo[] = STATES): StateInfo[] {
	return states.filter((state) => !hasDetailedGuidance(state));
}

/** Case-insensitive lookup by USPS code. */
export function findStateByCode(code: string, states: StateInfo[] = STATES): StateInfo | undefined {
	const wanted = code.trim().toUpperCase();
	return states.find((state) => state.code === wanted);
}

/**
 * Substring match on name or code, for the state filter box.
 *
 * An empty or whitespace-only query returns everything rather than nothing, so
 * clearing the box restores the full list.
 */
export function searchStates(query: string, states: StateInfo[] = STATES): StateInfo[] {
	const needle = query.trim().toLowerCase();
	if (!needle) return states;
	return states.filter(
		(state) =>
			state.name.toLowerCase().includes(needle) || state.code.toLowerCase().includes(needle)
	);
}

/**
 * How many states we have verified, as copy like "5 of 51".
 *
 * The page states this openly instead of implying full coverage - someone in
 * Ohio should know at a glance that they are on the generic path.
 */
export function coverageLabel(states: StateInfo[] = STATES): string {
	return `${detailedStates(states).length} of ${states.length}`;
}
