"use strict";

const LAST_UPDATED = "2026-02-18";
const DATASET_VERSION = "1.2.0";
const EFFECTIVE_DATE = "2026-02-18";
const KNOWLEDGE_BASELINE = {
  baseline_date: "2026-02-18",
  highlights: [
    "NIST SP 800-171 Rev.3 final published 2024-05-14.",
    "CMMC Program final rule (32 CFR Part 170) effective 2024-12-16.",
    "DFARS CMMC implementation (Subpart 204.75 and clauses 252.204-7021/-7025) effective 2025-11-10 with phased rollout through 2028-11-10.",
    "Expanded defense/aerospace baseline includes DFARS 252.204-7019/-7020, NIST SP 800-161r1, NIST SP 800-218 (SSDF), EASA Part-IS, NATO interoperability standards, avionics bus/interface standards, military qualification and EMI standards, aerospace quality baselines, and RTCA/SAE airworthiness assurance standards."
  ],
  references: [
    "https://csrc.nist.gov/pubs/sp/800/171/r3/final",
    "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program",
    "https://www.acquisition.gov/dfars/subpart-204.75-cybersecurity-maturity-model-certification-requirements",
    "https://www.acquisition.gov/dfars/252.204-7019-notice-nist-sp-800-171-dod-assessment-requirements",
    "https://www.acquisition.gov/dfars/252.204-7020-nist-sp-800-171-dod-assessment-requirements",
    "https://csrc.nist.gov/pubs/sp/800/161/r1/final",
    "https://csrc.nist.gov/pubs/sp/800/218/final",
    "https://csrc.nist.gov/pubs/sp/800/37/r2/final",
    "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
    "https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2023203",
    "https://www.easa.europa.eu/en/document-library/regulations/commission-delegated-regulation-eu-20221645",
    "https://nso.nato.int",
    "https://ecss.nl",
    "https://quicksearch.dla.mil",
    "https://www.sae.org/standards/content/as9100d/",
    "https://www.sae.org/standards/content/as9110c/",
    "https://www.opengroup.org/face",
    "https://www.opengroup.org/sosa"
  ]
};
const EU_MEMBER_STATE_CODES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE"
];
const EU_COUNTRY_NAME_TO_CODE = {
  austria: "AT",
  belgium: "BE",
  bulgaria: "BG",
  croatia: "HR",
  cyprus: "CY",
  "czech republic": "CZ",
  czechia: "CZ",
  denmark: "DK",
  estonia: "EE",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  hungary: "HU",
  ireland: "IE",
  italy: "IT",
  latvia: "LV",
  lithuania: "LT",
  luxembourg: "LU",
  malta: "MT",
  netherlands: "NL",
  poland: "PL",
  portugal: "PT",
  romania: "RO",
  slovakia: "SK",
  slovenia: "SI",
  spain: "ES",
  sweden: "SE"
};
const US_STATE_CODES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC"
];
const EU_NATO_MEMBER_CODES = [
  "BE",
  "BG",
  "HR",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IT",
  "LV",
  "LT",
  "LU",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE"
];
const NATO_MEMBER_CODES = [
  "AL",
  "BE",
  "BG",
  "CA",
  "HR",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IS",
  "IT",
  "LV",
  "LT",
  "LU",
  "ME",
  "NL",
  "MK",
  "NO",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "TR",
  "UK",
  "US"
];
const NATO_COUNTRY_NAME_TO_CODE = {
  albania: "AL",
  belgium: "BE",
  bulgaria: "BG",
  canada: "CA",
  croatia: "HR",
  "czech republic": "CZ",
  czechia: "CZ",
  denmark: "DK",
  estonia: "EE",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  hungary: "HU",
  iceland: "IS",
  italy: "IT",
  latvia: "LV",
  lithuania: "LT",
  luxembourg: "LU",
  montenegro: "ME",
  netherlands: "NL",
  "north macedonia": "MK",
  norway: "NO",
  poland: "PL",
  portugal: "PT",
  romania: "RO",
  slovakia: "SK",
  slovenia: "SI",
  spain: "ES",
  sweden: "SE",
  turkey: "TR",
  turkiye: "TR",
  "united kingdom": "UK",
  uk: "UK",
  "united states": "US",
  usa: "US"
};

const sources = [
  {
    id: "nist-800-171-r3",
    name: "NIST SP 800-171 Rev.3",
    source_type: "standard",
    content: "Protecting Controlled Unclassified Information in Nonfederal Systems and Organizations",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/171/r3/final",
    effective_date: "2024-05-14",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "nist-800-171a-r3",
    name: "NIST SP 800-171A Rev.3",
    source_type: "standard",
    content: "Assessing Security Requirements for Controlled Unclassified Information",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/171/a/r3/final",
    effective_date: "2024-05-14",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "nist-800-172",
    name: "NIST SP 800-172",
    source_type: "standard",
    content: "Enhanced Security Requirements for Protecting Controlled Unclassified Information",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/172/final",
    effective_date: "2021-02-24",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "nist-800-172-r3-fpd",
    name: "NIST SP 800-172 Rev.3 (FPD)",
    source_type: "standard",
    content: "Draft modernization track for enhanced CUI safeguards",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per draft revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/172/r3/fpd",
    effective_date: "2025-09-29",
    last_verified: "2026-02-18",
    knowledge_tier: "advisory"
  },
  {
    id: "dod-cmmc-32cfr170",
    name: "CMMC Program Rule (32 CFR Part 170)",
    source_type: "regulation",
    content: "CMMC 2.0 program codified in Federal Register final rule",
    provenance: "US Department of Defense / Federal Register",
    license: "Public domain (US government)",
    refresh_cadence: "Per publication",
    source_url: "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program",
    effective_date: "2024-12-16",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "dfars-cmmc-subpart-204-75",
    name: "DFARS Subpart 204.75 (CMMC requirements)",
    source_type: "regulation",
    content: "DFARS implementation of CMMC requirements and phased contract inclusion",
    provenance: "Acquisition.gov / DoD",
    license: "Public domain (US government)",
    refresh_cadence: "Per amendment",
    source_url: "https://www.acquisition.gov/dfars/subpart-204.75-cybersecurity-maturity-model-certification-requirements",
    effective_date: "2025-11-10",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "dfars-7012",
    name: "DFARS 252.204-7012",
    source_type: "regulation",
    content: "Safeguarding Covered Defense Information and Cyber Incident Reporting",
    provenance: "US Department of Defense",
    license: "Public domain (US government)",
    refresh_cadence: "Per amendment",
    source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting",
    effective_date: "2016-10-21",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "itar-usml",
    name: "ITAR / USML",
    source_type: "regulation",
    content: "International Traffic in Arms Regulations, 22 CFR 120-130",
    provenance: "US Department of State DDTC",
    license: "Public domain (US government)",
    refresh_cadence: "Per amendment",
    source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "ear-ccl",
    name: "EAR / Commerce Control List",
    source_type: "regulation",
    content: "Export Administration Regulations, 15 CFR 730-774",
    provenance: "US Department of Commerce BIS",
    license: "Public domain (US government)",
    refresh_cadence: "Per update",
    source_url: "https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "nispom",
    name: "32 CFR Part 117 (NISPOM Rule)",
    source_type: "regulation",
    content: "National Industrial Security Program Operating Manual",
    provenance: "DCSA",
    license: "Public domain (US government)",
    refresh_cadence: "Per update",
    source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117",
    effective_date: "2021-02-24",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "dodi-8500-01",
    name: "DoDI 8500.01 (Cybersecurity)",
    source_type: "policy",
    content: "DoD cybersecurity policy",
    provenance: "DoD Issuances",
    license: "Public domain (US government)",
    refresh_cadence: "Per publication",
    source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/",
    effective_date: "2025-11-13",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "dodi-8510-01",
    name: "DoDI 8510.01 (RMF for DoD IT)",
    source_type: "policy",
    content: "Risk Management Framework policy for DoD IT",
    provenance: "DoD Issuances",
    license: "Public domain (US government)",
    refresh_cadence: "Per publication",
    source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/",
    effective_date: "2022-07-19",
    last_verified: "2026-02-18",
    knowledge_tier: "advisory"
  },
  {
    id: "dodi-5200-48",
    name: "DoDI 5200.48 (CUI)",
    source_type: "policy",
    content: "Controlled Unclassified Information policy for the DoD",
    provenance: "DoD Issuances",
    license: "Public domain (US government)",
    refresh_cadence: "Per publication",
    source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/",
    effective_date: "2020-03-06",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "nato-cm-2002-49",
    name: "NATO Security Policy C-M(2002)49",
    source_type: "standard",
    content: "NATO security policy for classified information handling",
    provenance: "NATO",
    license: "NATO public summaries",
    refresh_cadence: "Per revision",
    source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "stanag-4774",
    name: "NATO STANAG 4774",
    source_type: "standard",
    content: "Confidentiality metadata label syntax",
    provenance: "NATO",
    license: "NATO public summaries",
    refresh_cadence: "Per revision",
    source_url: "https://nso.nato.int",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "stanag-4778",
    name: "NATO STANAG 4778",
    source_type: "standard",
    content: "Metadata binding mechanism",
    provenance: "NATO",
    license: "NATO public summaries",
    refresh_cadence: "Per revision",
    source_url: "https://nso.nato.int",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "eu-dual-use",
    name: "EU Dual-Use Regulation (EU) 2021/821",
    source_type: "regulation",
    content: "EU regime for control of exports, brokering, technical assistance, transit, and transfer of dual-use items",
    provenance: "EUR-Lex",
    license: "EU public law text",
    refresh_cadence: "Per amendment",
    source_url: "https://eur-lex.europa.eu/eli/reg/2021/821/oj",
    effective_date: "2021-09-09",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "eu-nis2",
    name: "NIS2 Directive (EU) 2022/2555",
    source_type: "regulation",
    content: "Union-wide cybersecurity risk management and incident reporting obligations for essential and important entities",
    provenance: "EUR-Lex",
    license: "EU public law text",
    refresh_cadence: "Per amendment",
    source_url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
    effective_date: "2023-01-16",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "eu-euci-2013-488",
    name: "Council Decision 2013/488/EU",
    source_type: "regulation",
    content: "Security rules for protecting EU classified information",
    provenance: "EUR-Lex",
    license: "EU public law text",
    refresh_cadence: "Per amendment",
    source_url: "https://eur-lex.europa.eu/eli/dec/2013/488/oj",
    effective_date: "2013-09-23",
    last_verified: "2026-02-18",
    knowledge_tier: "authoritative"
  },
  {
    id: "eu-cra",
    name: "EU Cyber Resilience Act (EU) 2024/2847",
    source_type: "regulation",
    content: "Horizontal cybersecurity requirements for products with digital elements placed on the EU market",
    provenance: "EUR-Lex",
    license: "EU public law text",
    refresh_cadence: "Per amendment",
    source_url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj",
    effective_date: "2024-12-10",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "dfars-7021",
    name: "DFARS 252.204-7021",
    source_type: "regulation",
    content: "Contractor Compliance with the Cybersecurity Maturity Model Certification Level Requirement",
    provenance: "Acquisition.gov / DoD",
    license: "Public domain (US government)",
    refresh_cadence: "Per amendment",
    source_url: "https://www.acquisition.gov/dfars/252.204-7021-contractor-compliance-cybersecurity-maturity-model-certification-level-requirement",
    effective_date: "2025-11-10",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "dfars-7025",
    name: "DFARS 252.204-7025",
    source_type: "regulation",
    content: "Subcontractor Compliance with the Cybersecurity Maturity Model Certification Level Requirement",
    provenance: "Acquisition.gov / DoD",
    license: "Public domain (US government)",
    refresh_cadence: "Per amendment",
    source_url: "https://www.acquisition.gov/dfars/252.204-7025",
    effective_date: "2025-11-10",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "dfars-7019",
    name: "DFARS 252.204-7019",
    source_type: "regulation",
    content: "Notice of NIST SP 800-171 DoD Assessment Requirements",
    provenance: "Acquisition.gov / DoD",
    license: "Public domain (US government)",
    refresh_cadence: "Per amendment",
    source_url: "https://www.acquisition.gov/dfars/252.204-7019-notice-nist-sp-800-171-dod-assessment-requirements",
    effective_date: "2020-11-30",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "dfars-7020",
    name: "DFARS 252.204-7020",
    source_type: "regulation",
    content: "NIST SP 800-171 DoD Assessment Requirements",
    provenance: "Acquisition.gov / DoD",
    license: "Public domain (US government)",
    refresh_cadence: "Per amendment",
    source_url: "https://www.acquisition.gov/dfars/252.204-7020-nist-sp-800-171-dod-assessment-requirements",
    effective_date: "2020-11-30",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "nist-800-161r1",
    name: "NIST SP 800-161 Rev.1",
    source_type: "standard",
    content: "Cybersecurity Supply Chain Risk Management Practices for Systems and Organizations",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/161/r1/final",
    effective_date: "2022-05-05",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "nist-800-218",
    name: "NIST SP 800-218 (SSDF)",
    source_type: "standard",
    content: "Secure Software Development Framework practices and implementation examples",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/218/final",
    effective_date: "2022-02-04",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "rtca-do-355",
    name: "RTCA DO-355 / ED-204",
    source_type: "standard",
    content: "Information security guidance for continuing airworthiness",
    provenance: "RTCA / EUROCAE",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.rtca.org/standards/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "rtca-do-178c",
    name: "RTCA DO-178C / ED-12C",
    source_type: "standard",
    content: "Software considerations in airborne systems and equipment certification",
    provenance: "RTCA / EUROCAE",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.rtca.org/standards/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "rtca-do-254",
    name: "RTCA DO-254 / ED-80",
    source_type: "standard",
    content: "Design assurance guidance for airborne electronic hardware",
    provenance: "RTCA / EUROCAE",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.rtca.org/standards/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "sae-arp4754a",
    name: "SAE ARP4754A",
    source_type: "standard",
    content: "Guidelines for development of civil aircraft and systems",
    provenance: "SAE International",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.sae.org/standards/content/arp4754a/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "sae-arp4761a",
    name: "SAE ARP4761A",
    source_type: "standard",
    content: "Safety assessment process for civil airborne systems and equipment",
    provenance: "SAE International",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.sae.org/standards/content/arp4761a/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "easa-part-is-2023-203",
    name: "EASA Part-IS (EU 2023/203)",
    source_type: "regulation",
    content: "Implementing rules for information security risk management in aviation (Part-IS)",
    provenance: "EASA / European Commission",
    license: "EU public law text",
    refresh_cadence: "Per amendment",
    source_url: "https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2023203",
    effective_date: "2023-10-22",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "easa-part-is-2022-1645",
    name: "EASA Part-IS (EU 2022/1645)",
    source_type: "regulation",
    content: "Delegated act introducing information security requirements for air operations and continuing airworthiness contexts",
    provenance: "EASA / European Commission",
    license: "EU public law text",
    refresh_cadence: "Per amendment",
    source_url: "https://www.easa.europa.eu/en/document-library/regulations/commission-delegated-regulation-eu-20221645",
    effective_date: "2022-09-14",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "nist-800-37r2",
    name: "NIST SP 800-37 Rev.2",
    source_type: "standard",
    content: "Risk Management Framework for information systems and organizations",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/37/r2/final",
    effective_date: "2018-12-20",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "nist-800-61r3",
    name: "NIST SP 800-61 Rev.3",
    source_type: "standard",
    content: "Incident response recommendations and lifecycle guidance",
    provenance: "NIST",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
    effective_date: "2025-04-03",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "stanag-4586",
    name: "NATO STANAG 4586",
    source_type: "standard",
    content: "Standard interfaces for UAV control system interoperability",
    provenance: "NATO Standardization Office",
    license: "NATO public summaries",
    refresh_cadence: "Per revision",
    source_url: "https://nso.nato.int",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "stanag-4609",
    name: "NATO STANAG 4609",
    source_type: "standard",
    content: "Digital motion imagery standard for ISR interoperability",
    provenance: "NATO Standardization Office",
    license: "NATO public summaries",
    refresh_cadence: "Per revision",
    source_url: "https://nso.nato.int",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "stanag-5516",
    name: "NATO STANAG 5516",
    source_type: "standard",
    content: "Tactical data exchange interoperability (Link 16) profile guidance",
    provenance: "NATO Standardization Office",
    license: "NATO public summaries",
    refresh_cadence: "Per revision",
    source_url: "https://nso.nato.int",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "ecss-e-st-40c",
    name: "ECSS-E-ST-40C",
    source_type: "standard",
    content: "Space engineering software general requirements",
    provenance: "ECSS",
    license: "Public summary / licensed detail",
    refresh_cadence: "Per revision",
    source_url: "https://ecss.nl",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "ecss-q-st-80c",
    name: "ECSS-Q-ST-80C",
    source_type: "standard",
    content: "Space product assurance software requirements",
    provenance: "ECSS",
    license: "Public summary / licensed detail",
    refresh_cadence: "Per revision",
    source_url: "https://ecss.nl",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "nasa-npr-7150-2",
    name: "NASA NPR 7150.2",
    source_type: "policy",
    content: "NASA software engineering requirements",
    provenance: "NASA NODIS",
    license: "Public domain (US government)",
    refresh_cadence: "Per revision",
    source_url: "https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7150&s=2",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "mil-std-1553",
    name: "MIL-STD-1553",
    source_type: "standard",
    content: "Digital time-division command/response multiplex data bus standard",
    provenance: "US DoD",
    license: "Public guidance",
    refresh_cadence: "Per revision",
    source_url: "https://quicksearch.dla.mil",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "mil-std-1760",
    name: "MIL-STD-1760",
    source_type: "standard",
    content: "Aircraft/store electrical interconnection system interface standards",
    provenance: "US DoD",
    license: "Public guidance",
    refresh_cadence: "Per revision",
    source_url: "https://quicksearch.dla.mil",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "rtca-do-160",
    name: "RTCA DO-160",
    source_type: "standard",
    content: "Environmental conditions and test procedures for airborne equipment",
    provenance: "RTCA",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.rtca.org/standards/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "face-technical-standard",
    name: "FACE Technical Standard",
    source_type: "standard",
    content: "Open architecture conformance profiles for airborne software portability and interoperability",
    provenance: "The Open Group FACE Consortium",
    license: "Public summary / licensed detail",
    refresh_cadence: "Per revision",
    source_url: "https://www.opengroup.org/face",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "sosa-technical-standard",
    name: "SOSA Technical Standard",
    source_type: "standard",
    content: "Sensor Open Systems Architecture technical profile for modular interoperable defense systems",
    provenance: "The Open Group SOSA Consortium",
    license: "Public summary / licensed detail",
    refresh_cadence: "Per revision",
    source_url: "https://www.opengroup.org/sosa",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "stanag-4671",
    name: "NATO STANAG 4671",
    source_type: "standard",
    content: "Unmanned aerial systems airworthiness requirements for NATO interoperability",
    provenance: "NATO Standardization Office",
    license: "NATO public summaries",
    refresh_cadence: "Per revision",
    source_url: "https://nso.nato.int",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "as9100d",
    name: "AS9100D",
    source_type: "standard",
    content: "Quality management systems requirements for aviation, space, and defense organizations",
    provenance: "IAQG / SAE International",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.sae.org/standards/content/as9100d/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "as9110c",
    name: "AS9110C",
    source_type: "standard",
    content: "Quality management systems requirements for aviation maintenance organizations",
    provenance: "IAQG / SAE International",
    license: "Licensed standard text",
    refresh_cadence: "Per revision",
    source_url: "https://www.sae.org/standards/content/as9110c/",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "mil-std-810",
    name: "MIL-STD-810",
    source_type: "standard",
    content: "Environmental engineering considerations and laboratory test methods",
    provenance: "US DoD",
    license: "Public guidance",
    refresh_cadence: "Per revision",
    source_url: "https://quicksearch.dla.mil",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "mil-std-461",
    name: "MIL-STD-461",
    source_type: "standard",
    content: "Requirements for control of electromagnetic interference characteristics of subsystems and equipment",
    provenance: "US DoD",
    license: "Public guidance",
    refresh_cadence: "Per revision",
    source_url: "https://quicksearch.dla.mil",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "mil-hdbk-516",
    name: "MIL-HDBK-516",
    source_type: "standard",
    content: "Airworthiness certification criteria for military aircraft systems",
    provenance: "US DoD",
    license: "Public guidance",
    refresh_cadence: "Per revision",
    source_url: "https://quicksearch.dla.mil",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "uk-osa-2023",
    name: "UK Official Secrets Act 2023",
    source_type: "regulation",
    content: "Modernised UK official secrets framework replacing OSA 1911/1989 provisions",
    provenance: "UK Parliament",
    license: "Open Government Licence",
    refresh_cadence: "Per amendment",
    source_url: "https://www.legislation.gov.uk/ukpga/2023/32/contents",
    effective_date: "2023-07-11",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "uk-cyber-essentials",
    name: "UK Cyber Essentials Plus (MoD requirement)",
    source_type: "standard",
    content: "UK baseline cybersecurity certification required for MoD contracts handling sensitive data",
    provenance: "NCSC / UK MoD",
    license: "Open Government Licence",
    refresh_cadence: "Per update",
    source_url: "https://www.ncsc.gov.uk/cyberessentials/overview",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "uk-defstan-05-138",
    name: "UK Defence Standard 05-138",
    source_type: "standard",
    content: "Cyber security for defence suppliers - requirements for defence contracts",
    provenance: "UK MoD",
    license: "UK MoD",
    refresh_cadence: "Per revision",
    source_url: "https://www.dstan.mod.uk",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  },
  {
    id: "mitre-attack",
    name: "MITRE ATT&CK",
    source_type: "threat-intel",
    content: "ATT&CK techniques and groups for enterprise and ICS",
    provenance: "MITRE",
    license: "Free use with attribution",
    refresh_cadence: "Quarterly",
    source_url: "https://attack.mitre.org",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    knowledge_tier: "authoritative"
  }
];

const clauseReferenceLibrary = [
  {
    id: "clause-cmmc-32cfr170-general",
    regulation_id: "CMMC_2_0",
    provision_ref: "32 CFR Part 170",
    title: "CMMC program requirements and assessment framework",
    summary: "Codifies CMMC level framework, assessment types, and implementation requirements.",
    source_id: "dod-cmmc-32cfr170",
    source_url: "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2024-12-16",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-dfars-20475-general",
    regulation_id: "DFARS_SUBPART_204_75",
    provision_ref: "DFARS Subpart 204.75",
    title: "CMMC contractual implementation and phase-in",
    summary: "Defines phased inclusion of CMMC in solicitations and contracts.",
    source_id: "dfars-cmmc-subpart-204-75",
    source_url: "https://www.acquisition.gov/dfars/subpart-204.75-cybersecurity-maturity-model-certification-requirements",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2025-11-10",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-dfars-7012-b",
    regulation_id: "DFARS_252.204-7012",
    provision_ref: "(b)",
    title: "Adequate security requirement for CDI",
    summary: "Requires contractors to provide adequate security for covered defense information.",
    source_id: "dfars-7012",
    source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2016-10-21",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-dfars-7012-d",
    regulation_id: "DFARS_252.204-7012_INCIDENT",
    provision_ref: "(d)",
    title: "72-hour cyber incident reporting",
    summary: "Requires reporting cyber incidents affecting covered defense information within 72 hours.",
    source_id: "dfars-7012",
    source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2016-10-21",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-far-52-204-21",
    regulation_id: "FAR_52.204-21",
    provision_ref: "all",
    title: "Basic safeguarding for FCI",
    summary: "Defines foundational safeguarding controls for federal contract information.",
    source_id: "dfars-cmmc-subpart-204-75",
    source_url: "https://www.acquisition.gov/far/52.204-21",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2016-06-15",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-itar-22cfr120-130",
    regulation_id: "ITAR_22_CFR_120_130",
    provision_ref: "22 CFR 120-130",
    title: "ITAR scope and controlled technical data",
    summary: "Defines defense articles, technical data, export controls, and authorization mechanisms.",
    source_id: "itar-usml",
    source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-ear-15cfr730-774",
    regulation_id: "EAR_15_CFR_730_774",
    provision_ref: "15 CFR 730-774",
    title: "EAR dual-use export framework",
    summary: "Defines ECCN classification, license requirements, and exceptions under EAR.",
    source_id: "ear-ccl",
    source_url: "https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-nis2-art21",
    regulation_id: "NIS2_DIRECTIVE_2022_2555",
    provision_ref: "Article 21",
    title: "Cybersecurity risk-management measures",
    summary: "Requires essential and important entities to implement cybersecurity risk-management measures.",
    source_id: "eu-nis2",
    source_url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
    legal_force: "directive",
    jurisdiction_scope: "EU",
    effective_date: "2023-01-16",
    last_verified: "2026-02-18",
    status: "effective-via-national-transposition"
  },
  {
    id: "clause-nis2-art23",
    regulation_id: "NIS2_DIRECTIVE_2022_2555_INCIDENT",
    provision_ref: "Article 23",
    title: "Incident reporting obligations",
    summary: "Defines multi-stage incident notification obligations and timelines.",
    source_id: "eu-nis2",
    source_url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
    legal_force: "directive",
    jurisdiction_scope: "EU",
    effective_date: "2023-01-16",
    last_verified: "2026-02-18",
    status: "effective-via-national-transposition"
  },
  {
    id: "clause-eu-dual-use-art3",
    regulation_id: "EU_DUAL_USE",
    provision_ref: "Article 3",
    title: "Authorization requirement for dual-use exports",
    summary: "Requires authorization for export of listed dual-use items and technology.",
    source_id: "eu-dual-use",
    source_url: "https://eur-lex.europa.eu/eli/reg/2021/821/oj",
    legal_force: "regulation",
    jurisdiction_scope: "EU",
    effective_date: "2021-09-09",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-euci-2013-488",
    regulation_id: "EUCI_HANDLING",
    provision_ref: "Council Decision 2013/488/EU",
    title: "EU classified information handling",
    summary: "Defines EUCI handling and security rules across institutions and member-state channels.",
    source_id: "eu-euci-2013-488",
    source_url: "https://eur-lex.europa.eu/eli/dec/2013/488/oj",
    legal_force: "decision",
    jurisdiction_scope: "EU",
    effective_date: "2013-09-23",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-nato-cm2002-49",
    regulation_id: "NATO_C_M_2002_49",
    provision_ref: "C-M(2002)49",
    title: "NATO security policy baseline",
    summary: "Defines handling, dissemination, and safeguarding baseline for NATO classified information.",
    source_id: "nato-cm-2002-49",
    source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm",
    legal_force: "alliance-policy",
    jurisdiction_scope: "NATO",
    effective_date: "rolling",
    last_verified: "2026-02-18",
    status: "effective"
  },
  {
    id: "clause-dfars-7021",
    regulation_id: "DFARS_252.204-7021",
    provision_ref: "252.204-7021",
    title: "Contractor CMMC Level Compliance",
    summary: "Requires contractors to achieve and maintain the CMMC level specified in the contract before award.",
    source_id: "dfars-7021",
    source_url: "https://www.acquisition.gov/dfars/252.204-7021-contractor-compliance-cybersecurity-maturity-model-certification-level-requirement",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2025-11-10",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-dfars-7025",
    regulation_id: "DFARS_252.204-7025",
    provision_ref: "252.204-7025",
    title: "Subcontractor CMMC Level Compliance",
    summary: "Requires prime contractors to ensure subcontractors achieve required CMMC levels for CUI/FCI flowdown.",
    source_id: "dfars-7025",
    source_url: "https://www.acquisition.gov/dfars/252.204-7025",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2025-11-10",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-dfars-7019",
    regulation_id: "DFARS_252.204-7019",
    provision_ref: "252.204-7019",
    title: "Notice of NIST SP 800-171 DoD assessment requirements",
    summary: "Requires offerors to ensure current NIST SP 800-171 assessment results are posted and available in SPRS.",
    source_id: "dfars-7019",
    source_url: "https://www.acquisition.gov/dfars/252.204-7019-notice-nist-sp-800-171-dod-assessment-requirements",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2020-11-30",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-dfars-7020",
    regulation_id: "DFARS_252.204-7020",
    provision_ref: "252.204-7020",
    title: "DoD assessment access and support requirements",
    summary: "Requires contractor support for DoD medium/high assessments including access to facilities, systems, and personnel.",
    source_id: "dfars-7020",
    source_url: "https://www.acquisition.gov/dfars/252.204-7020-nist-sp-800-171-dod-assessment-requirements",
    legal_force: "regulation",
    jurisdiction_scope: "US",
    effective_date: "2020-11-30",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-nist-800-161r1",
    regulation_id: "NIST_SP_800_161",
    provision_ref: "Rev.1",
    title: "Cybersecurity supply chain risk management practices",
    summary: "Defines enterprise and system lifecycle controls for supplier risk, provenance, and criticality analysis.",
    source_id: "nist-800-161r1",
    source_url: "https://csrc.nist.gov/pubs/sp/800/161/r1/final",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "2022-05-05",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-nist-800-218",
    regulation_id: "NIST_SP_800_218",
    provision_ref: "SSDF",
    title: "Secure software development framework baseline",
    summary: "Defines secure development practices across governance, implementation, verification, and vulnerability response.",
    source_id: "nist-800-218",
    source_url: "https://csrc.nist.gov/pubs/sp/800/218/final",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "2022-02-04",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-do-355",
    regulation_id: "DO_355",
    provision_ref: "ED-204",
    title: "Continuing airworthiness security guidance",
    summary: "Defines operational and maintenance-phase cybersecurity objectives to maintain airworthiness over system life.",
    source_id: "rtca-do-355",
    source_url: "https://www.rtca.org/standards/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-do-178c",
    regulation_id: "DO_178C",
    provision_ref: "ED-12C",
    title: "Airborne software design assurance",
    summary: "Defines software lifecycle objectives and evidence expectations by development assurance level.",
    source_id: "rtca-do-178c",
    source_url: "https://www.rtca.org/standards/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-do-254",
    regulation_id: "DO_254",
    provision_ref: "ED-80",
    title: "Airborne electronic hardware design assurance",
    summary: "Defines lifecycle planning, verification, and configuration expectations for airborne electronic hardware.",
    source_id: "rtca-do-254",
    source_url: "https://www.rtca.org/standards/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-arp4754a",
    regulation_id: "ARP4754A",
    provision_ref: "ARP4754A",
    title: "Aircraft and systems development process guidance",
    summary: "Defines integrated aircraft/system development processes, validation, and requirements traceability.",
    source_id: "sae-arp4754a",
    source_url: "https://www.sae.org/standards/content/arp4754a/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-arp4761a",
    regulation_id: "ARP4761A",
    provision_ref: "ARP4761A",
    title: "Aircraft/system safety assessment guidance",
    summary: "Defines FHA/PSSA/SSA safety assessment methods to support certification and risk acceptance.",
    source_id: "sae-arp4761a",
    source_url: "https://www.sae.org/standards/content/arp4761a/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-easa-part-is-2023-203",
    regulation_id: "EASA_PART_IS_2023_203",
    provision_ref: "Implementing Regulation (EU) 2023/203",
    title: "Aviation information security risk management and reporting requirements",
    summary: "Defines organizational ISMS, incident reporting, governance, and assurance obligations for regulated aviation entities.",
    source_id: "easa-part-is-2023-203",
    source_url: "https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2023203",
    legal_force: "regulation",
    jurisdiction_scope: "EU",
    effective_date: "2023-10-22",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-easa-part-is-2022-1645",
    regulation_id: "EASA_PART_IS_2022_1645",
    provision_ref: "Delegated Regulation (EU) 2022/1645",
    title: "Aviation information security requirements for air operations and continuing airworthiness",
    summary: "Establishes delegated information security obligations that complement operational and continuing airworthiness domains.",
    source_id: "easa-part-is-2022-1645",
    source_url: "https://www.easa.europa.eu/en/document-library/regulations/commission-delegated-regulation-eu-20221645",
    legal_force: "regulation",
    jurisdiction_scope: "EU",
    effective_date: "2022-09-14",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-nist-800-37r2",
    regulation_id: "NIST_SP_800_37",
    provision_ref: "Rev.2",
    title: "Risk Management Framework lifecycle",
    summary: "Defines prepare/categorize/select/implement/assess/authorize/monitor lifecycle for federal and mission systems.",
    source_id: "nist-800-37r2",
    source_url: "https://csrc.nist.gov/pubs/sp/800/37/r2/final",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "2018-12-20",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-nist-800-61r3",
    regulation_id: "NIST_SP_800_61",
    provision_ref: "Rev.3",
    title: "Incident response lifecycle and operational recommendations",
    summary: "Defines preparation, detection/analysis, containment/eradication/recovery, and post-incident activity guidance.",
    source_id: "nist-800-61r3",
    source_url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "2025-04-03",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-stanag-4586",
    regulation_id: "NATO_STANAG_4586",
    provision_ref: "STANAG 4586",
    title: "UAV control interface interoperability profile",
    summary: "Defines interface and message interoperability requirements for UAV command and control systems.",
    source_id: "stanag-4586",
    source_url: "https://nso.nato.int",
    legal_force: "alliance-policy",
    jurisdiction_scope: "NATO",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-stanag-4609",
    regulation_id: "NATO_STANAG_4609",
    provision_ref: "STANAG 4609",
    title: "ISR motion imagery interoperability baseline",
    summary: "Defines standardized formats and metadata for interoperable digital motion imagery in coalition ISR workflows.",
    source_id: "stanag-4609",
    source_url: "https://nso.nato.int",
    legal_force: "alliance-policy",
    jurisdiction_scope: "NATO",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-stanag-5516",
    regulation_id: "NATO_STANAG_5516",
    provision_ref: "STANAG 5516",
    title: "Tactical data link interoperability baseline (Link 16)",
    summary: "Defines tactical data exchange interoperability constraints and message handling profiles for coalition operations.",
    source_id: "stanag-5516",
    source_url: "https://nso.nato.int",
    legal_force: "alliance-policy",
    jurisdiction_scope: "NATO",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-ecss-e-st-40c",
    regulation_id: "ECSS_E_ST_40",
    provision_ref: "ECSS-E-ST-40C",
    title: "Space software engineering general requirements",
    summary: "Defines software lifecycle engineering requirements for space systems and mission segments.",
    source_id: "ecss-e-st-40c",
    source_url: "https://ecss.nl",
    legal_force: "standard-policy",
    jurisdiction_scope: "EU",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-ecss-q-st-80c",
    regulation_id: "ECSS_Q_ST_80",
    provision_ref: "ECSS-Q-ST-80C",
    title: "Space software product assurance requirements",
    summary: "Defines software assurance, verification, and quality objectives for space products and mission software.",
    source_id: "ecss-q-st-80c",
    source_url: "https://ecss.nl",
    legal_force: "standard-policy",
    jurisdiction_scope: "EU",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-nasa-npr-7150-2",
    regulation_id: "NASA_NPR_7150_2",
    provision_ref: "NPR 7150.2",
    title: "NASA software engineering requirements baseline",
    summary: "Defines software lifecycle and assurance requirements for NASA mission and supporting systems.",
    source_id: "nasa-npr-7150-2",
    source_url: "https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7150&s=2",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-mil-std-1553",
    regulation_id: "MIL_STD_1553",
    provision_ref: "MIL-STD-1553",
    title: "Digital avionics data bus interoperability baseline",
    summary: "Defines command/response data bus characteristics and interoperability constraints for avionics systems.",
    source_id: "mil-std-1553",
    source_url: "https://quicksearch.dla.mil",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-mil-std-1760",
    regulation_id: "MIL_STD_1760",
    provision_ref: "MIL-STD-1760",
    title: "Aircraft/store interface interoperability baseline",
    summary: "Defines electrical and data interface requirements between aircraft and stores/payloads.",
    source_id: "mil-std-1760",
    source_url: "https://quicksearch.dla.mil",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-do-160",
    regulation_id: "DO_160",
    provision_ref: "DO-160",
    title: "Airborne equipment environmental qualification baseline",
    summary: "Defines environmental test and qualification expectations for airborne equipment resilience.",
    source_id: "rtca-do-160",
    source_url: "https://www.rtca.org/standards/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-face-ts",
    regulation_id: "FACE_TS",
    provision_ref: "FACE Technical Standard",
    title: "Open airborne software portability and interoperability profile",
    summary: "Defines conformance profiles that improve airborne software portability, reuse, and interoperability.",
    source_id: "face-technical-standard",
    source_url: "https://www.opengroup.org/face",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-sosa-ts",
    regulation_id: "SOSA_TS",
    provision_ref: "SOSA Technical Standard",
    title: "Open modular sensor architecture baseline",
    summary: "Defines modular sensor architecture profiles supporting interoperability and rapid capability insertion.",
    source_id: "sosa-technical-standard",
    source_url: "https://www.opengroup.org/sosa",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-stanag-4671",
    regulation_id: "NATO_STANAG_4671",
    provision_ref: "STANAG 4671",
    title: "NATO UAS airworthiness interoperability baseline",
    summary: "Defines common UAS airworthiness criteria to support coalition interoperability and certification alignment.",
    source_id: "stanag-4671",
    source_url: "https://nso.nato.int",
    legal_force: "alliance-policy",
    jurisdiction_scope: "NATO",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-as9100d",
    regulation_id: "AS9100D_QMS",
    provision_ref: "AS9100D",
    title: "Aviation, space, and defense quality management baseline",
    summary: "Defines QMS requirements for risk-based planning, configuration control, and product realization in aerospace programs.",
    source_id: "as9100d",
    source_url: "https://www.sae.org/standards/content/as9100d/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-as9110c",
    regulation_id: "AS9110C_MRO_QMS",
    provision_ref: "AS9110C",
    title: "Aviation maintenance quality management baseline",
    summary: "Defines QMS requirements for maintenance, repair, and overhaul organizations supporting aerospace fleets.",
    source_id: "as9110c",
    source_url: "https://www.sae.org/standards/content/as9110c/",
    legal_force: "standard-policy",
    jurisdiction_scope: "INTL",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-mil-std-810",
    regulation_id: "MIL_STD_810",
    provision_ref: "MIL-STD-810",
    title: "Environmental engineering qualification baseline",
    summary: "Defines environmental profile tailoring and test methods for defense equipment qualification.",
    source_id: "mil-std-810",
    source_url: "https://quicksearch.dla.mil",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-mil-std-461",
    regulation_id: "MIL_STD_461",
    provision_ref: "MIL-STD-461",
    title: "Electromagnetic compatibility qualification baseline",
    summary: "Defines EMI/EMC control and verification requirements for defense subsystems and equipment.",
    source_id: "mil-std-461",
    source_url: "https://quicksearch.dla.mil",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-mil-hdbk-516",
    regulation_id: "MIL_HDBK_516",
    provision_ref: "MIL-HDBK-516",
    title: "Military airworthiness certification criteria baseline",
    summary: "Defines military aircraft airworthiness certification criteria and verification evidence expectations.",
    source_id: "mil-hdbk-516",
    source_url: "https://quicksearch.dla.mil",
    legal_force: "standard-policy",
    jurisdiction_scope: "US",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-eu-cra-art6",
    regulation_id: "EU_CRA_2024_2847",
    provision_ref: "Article 6",
    title: "Essential cybersecurity requirements for products with digital elements",
    summary: "Defines essential cybersecurity requirements for design, development, production, and vulnerability handling of products with digital elements.",
    source_id: "eu-cra",
    source_url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj",
    legal_force: "regulation",
    jurisdiction_scope: "EU",
    effective_date: "2024-12-10",
    last_verified: LAST_UPDATED,
    status: "effective"
  },
  {
    id: "clause-uk-defstan-05-138",
    regulation_id: "UK_DEFSTAN_05_138",
    provision_ref: "Def Stan 05-138",
    title: "UK defence supplier cyber security requirements",
    summary: "Mandates cyber security baseline controls for UK MoD suppliers and subcontractors handling defence information.",
    source_id: "uk-defstan-05-138",
    source_url: "https://www.dstan.mod.uk",
    legal_force: "standard-policy",
    jurisdiction_scope: "UK",
    effective_date: "rolling",
    last_verified: LAST_UPDATED,
    status: "effective"
  }
];

const architecturePatterns = [
  {
    id: "da-classified-enclave",
    name: "Classified Network Enclave",
    category: "classified",
    description:
      "Segregated enclave for national/NATO classified processing with strict cross-domain mediation and physical security enforcement.",
    components: [
      "Cross-domain solution",
      "Classified LAN",
      "Secure workstations",
      "Key management infrastructure",
      "TEMPEST controls",
      "Physical access control"
    ],
    trust_boundaries: [
      {
        boundary: "External-to-classified ingress",
        rationale: "All traffic into classified enclave must traverse accredited CDS boundary."
      },
      {
        boundary: "Role-based insider boundary",
        rationale: "Cleared administrators and analysts require separation of duties and two-person integrity for critical actions."
      }
    ],
    data_flows: [
      {
        data_type: "NATO/EU/national classified",
        source: "Mission systems",
        destination: "Classified data lake",
        protocol: "One-way guarded transfer",
        encryption: "Type 1 / national-approved crypto"
      },
      {
        data_type: "Intelligence reports",
        source: "Analysis workstations",
        destination: "Command dissemination",
        protocol: "Label-aware message bus",
        encryption: "Classified transport profile"
      }
    ],
    integration_points: [
      "Cross-domain guard",
      "Classified PKI/KMI",
      "Mission partner federation"
    ],
    known_weaknesses: [
      "CDS rule misconfiguration",
      "Privilege misuse inside enclave",
      "Removable media bridge risk"
    ],
    applicable_standards: ["CNSSI_1253", "NATO_STANAG_4774", "NATO_SDIP_27", "JSIG"],
    regulatory_hot_spots: ["NISPOM", "NATO C-M(2002)49", "Council Decision 2013/488/EU"],
    citations: [
      { type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" },
      { type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }
    ]
  },
  {
    id: "da-cui-environment",
    name: "CUI Processing Environment",
    category: "cui",
    description:
      "Environment boundary for Controlled Unclassified Information with CMMC-aligned controls and DFARS reporting capabilities.",
    components: [
      "CUI system boundary",
      "Identity and access management",
      "Encryption services",
      "Centralized audit logging",
      "Incident response tooling",
      "Media protection controls"
    ],
    trust_boundaries: [
      {
        boundary: "Corporate IT to CUI enclave",
        rationale: "FCI/CUI flow separation reduces spill and non-compliant access risk."
      },
      {
        boundary: "Supplier exchange boundary",
        rationale: "External collaboration requires technical transfer controls and flowdown enforcement."
      }
    ],
    data_flows: [
      {
        data_type: "CUI",
        source: "Program management",
        destination: "Secure document vault",
        protocol: "HTTPS/TLS 1.2+",
        encryption: "FIPS-validated crypto at rest and in transit"
      },
      {
        data_type: "Incident telemetry",
        source: "Security stack",
        destination: "SOC SIEM",
        protocol: "Syslog over TLS",
        encryption: "TLS with mutual authentication"
      }
    ],
    integration_points: ["Supplier portal", "DoD reporting channels", "Security controls MCP crosswalk"],
    known_weaknesses: [
      "CUI tagging inconsistency",
      "Legacy endpoints without hardening",
      "Weak supplier segmentation"
    ],
    applicable_standards: ["NIST_SP_800_171", "CMMC_2_0", "NIST_SP_800_53_DOD_OVERLAY"],
    regulatory_hot_spots: ["DFARS 252.204-7012", "FAR 52.204-21"],
    citations: [
      { type: "CFR", ref: "32 CFR 2002", source_url: "https://www.ecfr.gov/current/title-32/subtitle-B/chapter-XX/part-2002" },
      { type: "CFR", ref: "DFARS 252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" }
    ]
  },
  {
    id: "da-weapons-system",
    name: "Weapons System IT",
    category: "mission",
    description:
      "Cyber-physical weapon platform architecture with mission computer, tactical links, and embedded sensors in real-time environments.",
    components: [
      "Mission computer",
      "Tactical network interface",
      "Weapon interface",
      "C2 integration bus",
      "Real-time operating system",
      "Embedded sensors"
    ],
    trust_boundaries: [
      {
        boundary: "Mission assurance boundary",
        rationale: "Safety-critical function paths require strict integrity and timing guarantees."
      },
      {
        boundary: "Supply-chain firmware boundary",
        rationale: "Third-party firmware artifacts introduce provenance and tamper risk."
      }
    ],
    data_flows: [
      {
        data_type: "Targeting/control data",
        source: "C2 node",
        destination: "Mission computer",
        protocol: "MIL tactical protocol",
        encryption: "Mission-grade encrypted link"
      },
      {
        data_type: "Sensor telemetry",
        source: "Embedded sensors",
        destination: "Weapons analytics",
        protocol: "Deterministic bus",
        encryption: "Platform-dependent"
      }
    ],
    integration_points: ["Tactical datalink", "Simulation environment", "Program protection repository"],
    known_weaknesses: [
      "Legacy component software",
      "GPS/PNT dependencies",
      "Insufficient runtime attestation"
    ],
    applicable_standards: [
      "MIL_STD_882",
      "MIL_STD_1553",
      "MIL_STD_1760",
      "MIL_STD_810",
      "MIL_STD_461",
      "MIL_HDBK_516",
      "DO_160",
      "DODI_8510_01",
      "DO_326A",
      "AS9100D_QMS"
    ],
    regulatory_hot_spots: ["Program Protection Plans", "RMF authorization", "ITAR technical data controls"],
    citations: [
      { type: "MIL", ref: "MIL-STD-882", source_url: "https://quicksearch.dla.mil" },
      { type: "DODI", ref: "DoDI 8510.01", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }
    ]
  },
  {
    id: "da-c2",
    name: "Command and Control",
    category: "mission",
    description:
      "Command-and-control platform integrating COP, message handling, and decision support under coalition interoperability constraints.",
    components: [
      "C2 application",
      "COP services",
      "Message broker",
      "Communications gateway",
      "Decision support engine"
    ],
    trust_boundaries: [
      {
        boundary: "Coalition sharing boundary",
        rationale: "Information release policy enforcement per nation/caveat is mandatory."
      }
    ],
    data_flows: [
      {
        data_type: "Operational tasking",
        source: "Joint HQ",
        destination: "Field C2 nodes",
        protocol: "STANAG messaging",
        encryption: "Mission network crypto"
      }
    ],
    integration_points: ["NATO federation", "ISR ingest", "Joint fires systems"],
    known_weaknesses: ["Cross-domain translation errors", "Labeling/caveat drift"],
    applicable_standards: ["NATO_STANAG_4774", "NATO_STANAG_4778", "NATO_STANAG_5516", "SOSA_TS", "ICD_503"],
    regulatory_hot_spots: ["NATO security agreements", "National disclosure policies"],
    citations: [
      { type: "NATO", ref: "STANAG 4774", source_url: "https://nso.nato.int" }
    ]
  },
  {
    id: "da-isr",
    name: "ISR Processing",
    category: "mission",
    description:
      "Sensor fusion and intelligence exploitation pipeline from collection to dissemination and archive.",
    components: [
      "Sensor ingest",
      "Data fusion",
      "Exploitation tools",
      "Dissemination services",
      "Storage/archive"
    ],
    trust_boundaries: [
      {
        boundary: "Source reliability boundary",
        rationale: "Data provenance and integrity checks prevent manipulation of intelligence products."
      }
    ],
    data_flows: [
      {
        data_type: "SIGINT/IMINT feeds",
        source: "Collection platforms",
        destination: "Fusion node",
        protocol: "Mission ingest protocol",
        encryption: "Classified transport"
      }
    ],
    integration_points: ["National intelligence exchange", "C2 dissemination"],
    known_weaknesses: ["Data poisoning in multi-source fusion", "Insider query abuse"],
    applicable_standards: ["ICD_503", "NATO_STANAG_4778", "NATO_STANAG_4609"],
    regulatory_hot_spots: ["National intelligence acts", "Program protection controls"],
    citations: [{ type: "IC", ref: "ICD 503", source_url: "https://www.dni.gov" }]
  },
  {
    id: "da-tactical-network",
    name: "Tactical Communication Network",
    category: "communications",
    description:
      "Radio/MANET/satellite tactical communications with COMSEC and resilient mobility under contested conditions.",
    components: [
      "Radio systems",
      "MANET routing",
      "SATCOM links",
      "Network management",
      "COMSEC modules",
      "Cross-domain gateway"
    ],
    trust_boundaries: [
      {
        boundary: "RF exposure boundary",
        rationale: "Adversarial interception and jamming threats require anti-jam and EMCON controls."
      }
    ],
    data_flows: [
      {
        data_type: "Tactical voice/data",
        source: "Forward units",
        destination: "Battlegroup command",
        protocol: "Tactical waveform",
        encryption: "COMSEC module"
      }
    ],
    integration_points: ["Satellite gateway", "C2 systems"],
    known_weaknesses: ["Jamming susceptibility", "Key rollover failures"],
    applicable_standards: ["CNSSI_1253", "NATO_SDIP_27", "NATO_STANAG_5516"],
    regulatory_hot_spots: ["National COMSEC doctrine"],
    citations: [{ type: "NATO", ref: "SDIP-27", source_url: "https://nso.nato.int" }]
  },
  {
    id: "da-satellite",
    name: "Satellite/Space System",
    category: "space",
    description:
      "Ground and mission segment architecture for secure payload operations and command uplink integrity.",
    components: ["Ground segment", "Mission control", "Payload management", "Link encryption", "Space vehicle"],
    trust_boundaries: [
      {
        boundary: "Ground-to-space command boundary",
        rationale: "Authenticated command chains are required to prevent unauthorized orbital operations."
      }
    ],
    data_flows: [
      {
        data_type: "Telemetry/command",
        source: "Mission control",
        destination: "Space vehicle",
        protocol: "Space command protocol",
        encryption: "Mission-specific link crypto"
      }
    ],
    integration_points: ["Space situational awareness feeds", "Mission assurance SOC"],
    known_weaknesses: ["Ground station compromise", "Replay on command link"],
    applicable_standards: ["DODI_8510_01", "NIST_SP_800_53_DOD_OVERLAY", "ECSS_E_ST_40", "ECSS_Q_ST_80", "NASA_NPR_7150_2"],
    regulatory_hot_spots: ["Export control on payload tech"],
    citations: [{ type: "DODI", ref: "DoDI 8510.01", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  },
  {
    id: "da-uav",
    name: "Unmanned Aerial Vehicle",
    category: "aerospace",
    description:
      "UAV mission system architecture with ground control station, datalink security, and autonomous control protections.",
    components: ["Ground control station", "Data link", "Mission manager", "Payload control", "Autonomous navigation"],
    trust_boundaries: [
      {
        boundary: "Command-link boundary",
        rationale: "Command integrity and anti-hijack controls are mission-critical for UAV safety and security."
      }
    ],
    data_flows: [
      {
        data_type: "Flight commands",
        source: "GCS",
        destination: "UAV",
        protocol: "Encrypted telemetry/control",
        encryption: "Strong auth + encrypted channel"
      }
    ],
    integration_points: ["ISR payload network", "Airspace management"],
    known_weaknesses: ["GNSS spoofing", "Uplink takeover"],
    applicable_standards: [
      "DO_326A",
      "DO_356A",
      "DO_355",
      "DO_178C",
      "DO_254",
      "ARP4754A",
      "ARP4761A",
      "EASA_PART_IS",
      "NATO_STANAG_4586",
      "NATO_STANAG_4609",
      "NATO_STANAG_4671",
      "DO_160",
      "MIL_STD_810",
      "MIL_STD_461",
      "MIL_HDBK_516",
      "FACE_TS",
      "AS9100D_QMS",
      "AS9110C_MRO_QMS",
      "MIL_STD_882"
    ],
    regulatory_hot_spots: ["Airworthiness cybersecurity evidence"],
    citations: [{ type: "RTCA", ref: "DO-326A", source_url: "https://www.rtca.org" }]
  },
  {
    id: "da-supply-chain",
    name: "Defense Supply Chain",
    category: "supply-chain",
    description:
      "Defense industrial base supplier ecosystem for controlled technical data exchange, parts provenance, and flowdown compliance.",
    components: [
      "Cleared facility systems",
      "ITAR compliance workflow",
      "Parts tracking",
      "Subcontractor portal",
      "Audit trail services"
    ],
    trust_boundaries: [
      {
        boundary: "Prime-subcontractor boundary",
        rationale: "Flowdown obligations and technical data transfer controls must be enforceable per contract and export law."
      }
    ],
    data_flows: [
      {
        data_type: "Technical data package",
        source: "Prime OEM",
        destination: "Qualified subcontractor",
        protocol: "Secure exchange portal",
        encryption: "FIPS-compliant encryption"
      }
    ],
    integration_points: ["ERP/PLM", "Export licensing system", "CMMC status registry"],
    known_weaknesses: [
      "Counterfeit parts insertion",
      "Supplier endpoint compromise",
      "Unauthorized ITAR transfer"
    ],
    applicable_standards: [
      "CMMC_2_0",
      "NIST_SP_800_171",
      "NIST_SP_800_161",
      "NIST_SP_800_218",
      "DFARS_7019_ASSESSMENT",
      "DFARS_7020_ASSESSMENT",
      "AS9100D_QMS",
      "AS9110C_MRO_QMS",
      "NISPOM"
    ],
    regulatory_hot_spots: ["ITAR/EAR", "DFARS 252.246-7008", "FOCI review"],
    citations: [
      { type: "CFR", ref: "22 CFR 120-130", source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M" },
      { type: "DFARS", ref: "252.246-7008", source_url: "https://www.acquisition.gov/dfars" }
    ]
  },
  {
    id: "da-mil-cloud",
    name: "Military/Government Cloud (IL4-IL6)",
    category: "cloud",
    description:
      "Government cloud deployment pattern with impact-level segmentation, key isolation, and cross-domain integration.",
    components: ["IL-specific tenancy", "Cross-domain broker", "Key management", "Virtual desktop", "Encrypted storage"],
    trust_boundaries: [
      {
        boundary: "Impact level segregation",
        rationale: "Workloads cannot co-mingle across disallowed IL boundaries without accredited mediation."
      }
    ],
    data_flows: [
      {
        data_type: "Mission workload data",
        source: "Program systems",
        destination: "IL cloud region",
        protocol: "Private encrypted links",
        encryption: "At-rest and in-transit with mission keys"
      }
    ],
    integration_points: ["DoD identity federation", "CDS services"],
    known_weaknesses: ["Tenant boundary misconfigurations", "Excessive privileged cloud roles"],
    applicable_standards: ["NIST_SP_800_53_DOD_OVERLAY", "NIST_SP_800_37", "DODI_8500_01"],
    regulatory_hot_spots: ["Impact level authorization", "Deemed export in cloud admin access"],
    citations: [{ type: "DODI", ref: "DoDI 8500.01", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  },
  {
    id: "da-sim-training",
    name: "Simulation & Training",
    category: "training",
    description:
      "Live-virtual-constructive training environment with federation and after-action analytics.",
    components: ["Synthetic environment", "LVC federation", "AAR analytics", "Training network"],
    trust_boundaries: [
      {
        boundary: "Exercise-to-production boundary",
        rationale: "Exercise infrastructure must not provide pivot path into operational mission systems."
      }
    ],
    data_flows: [
      {
        data_type: "Exercise telemetry",
        source: "Range systems",
        destination: "AAR platform",
        protocol: "Training federation protocols",
        encryption: "Program-specific"
      }
    ],
    integration_points: ["Mission rehearsal tools", "Program lessons database"],
    known_weaknesses: ["Synthetic-to-live data leakage", "Weak federation trust controls"],
    applicable_standards: ["NIST_SP_800_171", "MIL_STD_882"],
    regulatory_hot_spots: ["Program data handling controls"],
    citations: [{ type: "NIST", ref: "SP 800-171", source_url: "https://csrc.nist.gov/pubs/sp/800/171/r3/final" }]
  },
  {
    id: "da-dev-secure",
    name: "Secure Development Environment",
    category: "engineering",
    description:
      "Secure development and CI/CD environment for defense software with accreditation-ready artifacts.",
    components: [
      "Secure code repository",
      "Classified/controlled build workers",
      "CI/CD pipeline",
      "SAST/DAST",
      "Secure transfer gateway",
      "Accreditation evidence store"
    ],
    trust_boundaries: [
      {
        boundary: "Developer workstation to build boundary",
        rationale: "Untrusted developer endpoints cannot directly manipulate trusted release artifacts."
      },
      {
        boundary: "Open-source ingest boundary",
        rationale: "External dependencies require provenance, SBOM, and malware/supply-chain screening."
      }
    ],
    data_flows: [
      {
        data_type: "Source and binaries",
        source: "Repo",
        destination: "Build pipeline",
        protocol: "Signed artifact promotion",
        encryption: "Internal PKI"
      }
    ],
    integration_points: ["Artifact signing service", "SBOM tooling", "RMF package generator"],
    known_weaknesses: ["Build system credential theft", "Dependency confusion", "Unsigned artifact promotion"],
    applicable_standards: ["NIST_SP_800_171", "NIST_SP_800_172", "DO_356A"],
    regulatory_hot_spots: ["CMMC evidence", "Software supply chain attestations"],
    citations: [{ type: "NIST", ref: "SP 800-172", source_url: "https://csrc.nist.gov/pubs/sp/800/172/final" }]
  }
];

const dataCategories = [
  {
    id: "cui",
    name: "CUI (US)",
    description: "Controlled Unclassified Information in US federal and DoD contracting contexts.",
    boundary_conditions:
      "Includes CUI Basic and Specified categories designated by CUI registry. Excludes publicly releasable information.",
    jurisdiction_protections: {
      US: {
        regime: ["32 CFR Part 2002", "NIST SP 800-171", "CMMC 2.0", "DFARS 252.204-7012"],
        tier: "high",
        controls: ["Access control", "Audit and accountability", "Media protection", "Incident reporting (72h)"]
      },
      SE: {
        regime: ["Defense procurement security clauses", "NATO security agreements (when shared)"],
        tier: "high",
        controls: ["Equivalent controlled information handling", "Supplier vetting", "Need-to-know enforcement"]
      }
    },
    deidentification_requirements: ["Contextual minimization", "Marking and downgrading review"],
    cross_border_constraints: ["Flowdown obligations to foreign subcontractors", "Need contractual and legal transfer basis"],
    required_controls: ["NIST 800-171 families", "CMMC-scoped SSP", "CUI labeling"],
    permitted_uses: ["Contract performance", "Authorized program support"],
    citations: [{ type: "CFR", ref: "32 CFR 2002", source_url: "https://www.ecfr.gov/current/title-32/subtitle-B/chapter-XX/part-2002" }]
  },
  {
    id: "itar-controlled",
    name: "ITAR-controlled",
    description: "Defense articles, technical data, and defense services controlled under ITAR.",
    boundary_conditions: "USML-controlled items and related technical data/services.",
    jurisdiction_protections: {
      US: {
        regime: ["ITAR 22 CFR 120-130", "DDTC registration", "TAA/MLA"],
        tier: "restricted",
        controls: ["Technology control plan", "License screening", "Deemed export controls", "US person access gating"]
      },
      UK: {
        regime: ["US-UK defense trade treaty applicability (case-specific)", "UK export control compliance"],
        tier: "restricted",
        controls: ["TAA authorization", "Recipient eligibility", "Re-transfer restrictions"]
      },
      EU: {
        regime: ["Recipient-state import controls", "US licensing terms"],
        tier: "restricted",
        controls: ["License verification", "Technical data segregation"]
      }
    },
    deidentification_requirements: ["Remove technical performance specifics only if decontrol approved"],
    cross_border_constraints: ["No export or re-transfer without authorization", "Deemed export applies to foreign national access"],
    required_controls: ["TCP", "Visitor/remote access controls", "Export review workflow"],
    permitted_uses: ["Authorized defense program execution only"],
    citations: [{ type: "CFR", ref: "22 CFR 120-130", source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M" }]
  },
  {
    id: "ear-controlled",
    name: "EAR-controlled",
    description: "Dual-use items and technology controlled by EAR.",
    boundary_conditions: "Includes ECCN-classified software/technology/hardware not exclusively ITAR.",
    jurisdiction_protections: {
      US: {
        regime: ["EAR 15 CFR 730-774", "Commerce Control List", "Entity List screening"],
        tier: "high",
        controls: ["ECCN classification", "Destination/end-user screening", "License exception review"]
      },
      EU: {
        regime: ["EU dual-use implementation", "Member-state export authority obligations"],
        tier: "high",
        controls: ["Re-export compliance", "Controlled technology transfer controls"]
      }
    },
    deidentification_requirements: ["No public release if technical detail remains controlled"],
    cross_border_constraints: ["Check destination controls and end-use restrictions"],
    required_controls: ["Export classification records", "Denied-party screening"],
    permitted_uses: ["Authorized commercial or defense use per license/exception"],
    citations: [{ type: "CFR", ref: "15 CFR 730-774", source_url: "https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C" }]
  },
  {
    id: "fci",
    name: "FCI",
    description: "Federal Contract Information not intended for public release.",
    boundary_conditions: "Information provided by or generated for the US government under contract.",
    jurisdiction_protections: {
      US: {
        regime: ["FAR 52.204-21", "CMMC Level 1"],
        tier: "moderate",
        controls: ["Basic safeguarding", "Authentication", "Physical access restrictions"]
      }
    },
    deidentification_requirements: ["Remove contract-specific identifiers before external use"],
    cross_border_constraints: ["Contract terms may restrict offshore handling"],
    required_controls: ["17 foundational practices"],
    permitted_uses: ["Contract execution"],
    citations: [{ type: "FAR", ref: "52.204-21", source_url: "https://www.acquisition.gov/far/52.204-21" }]
  },
  {
    id: "nato-classified",
    name: "NATO classified",
    description: "NATO classified information (COSMIC TS, NS, NC, NR).",
    boundary_conditions: "Requires NATO and national security authority handling controls.",
    jurisdiction_protections: {
      SE: {
        regime: ["NATO security agreement implementation", "Swedish national security authority guidance"],
        tier: "classified",
        controls: ["Facility/personnel clearance", "Secure communications", "Document accountability"]
      },
      NL: {
        regime: ["NATO implementation via national security authority"],
        tier: "classified",
        controls: ["National caveat enforcement", "Classified system accreditation"]
      },
      US: {
        regime: ["NATO C-M(2002)49", "NISPOM"],
        tier: "classified",
        controls: ["COMSEC", "Classified media handling", "Visit authorization"]
      }
    },
    deidentification_requirements: ["Not generally de-identifiable; downgrade requires authority"],
    cross_border_constraints: ["Only between authorized NATO participants with valid need-to-know"],
    required_controls: ["STANAG 4774 labeling", "STANAG 4778 binding"],
    permitted_uses: ["Authorized NATO mission activities"],
    citations: [{ type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }]
  },
  {
    id: "eu-classified",
    name: "EU classified",
    description: "EUCI from RESTREINT UE through TRES SECRET UE.",
    boundary_conditions: "Handled under EU Council security rules and national implementations.",
    jurisdiction_protections: {
      EU: {
        regime: ["Council Decision 2013/488/EU"],
        tier: "classified",
        controls: ["Security clearance", "Handling and marking requirements", "Secure transmission"]
      }
    },
    deidentification_requirements: ["Downgrade/declassification by competent authority only"],
    cross_border_constraints: ["Requires authorized EU member-state channels"],
    required_controls: ["Security area controls", "Classified comms"],
    permitted_uses: ["Authorized EU mission operations"],
    citations: [{ type: "EU", ref: "2013/488/EU", source_url: "https://eur-lex.europa.eu/eli/dec/2013/488/oj" }]
  },
  {
    id: "national-classified",
    name: "National classified (country specific)",
    description: "National security classifications and controls for member states.",
    boundary_conditions: "Varies by country law and security authority implementation.",
    jurisdiction_protections: {
      SE: {
        regime: ["Swedish Protective Security Act and regulations"],
        tier: "classified",
        controls: ["Security-protected procurement", "Personnel vetting", "Protective security analysis"]
      },
      DE: {
        regime: ["German classified information handling rules"],
        tier: "classified",
        controls: ["VS-NfD controls", "Need-to-know" ]
      },
      US: {
        regime: ["EO 13526", "NISPOM", "agency regulations"],
        tier: "classified",
        controls: ["Classified system authorization", "Document control"]
      }
    },
    deidentification_requirements: ["Not applicable without declassification"],
    cross_border_constraints: ["Bilateral/multilateral security agreements required"],
    required_controls: ["Country-specific classified controls"],
    permitted_uses: ["Authorized national security missions"],
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  },
  {
    id: "weapons-system-data",
    name: "Weapons system data",
    description: "Design, performance, vulnerability, and mission parameter data for weapon systems.",
    boundary_conditions: "Often controlled as classified, ITAR, EAR, or CPI depending on context.",
    jurisdiction_protections: {
      US: {
        regime: ["Program Protection (DoDI 5200.39)", "ITAR/EAR", "RMF"],
        tier: "restricted",
        controls: ["CPI identification", "Supply chain risk management", "Mission assurance monitoring"]
      },
      NATO: {
        regime: ["NATO handling policy (as applicable)", "national caveats"],
        tier: "restricted",
        controls: ["Need-to-know sharing", "classification metadata"]
      }
    },
    deidentification_requirements: ["Redaction requires export/legal review"],
    cross_border_constraints: ["Program-level release authority required"],
    required_controls: ["Program protection plan", "strict release process"],
    permitted_uses: ["Program execution, sustainment, approved interoperability"],
    citations: [{ type: "DODI", ref: "5200.39", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  },
  {
    id: "intelligence-data",
    name: "Intelligence data",
    description: "SIGINT/HUMINT/IMINT and derived intelligence products.",
    boundary_conditions: "Handling dictated by national intelligence frameworks and agreements.",
    jurisdiction_protections: {
      US: {
        regime: ["ICD 503", "national intelligence directives"],
        tier: "classified",
        controls: ["Mission assurance", "compartment access", "auditable dissemination"]
      },
      NATO: {
        regime: ["NATO intelligence sharing agreements"],
        tier: "classified",
        controls: ["Caveat tagging", "release controls"]
      }
    },
    deidentification_requirements: ["Sanitization and source protection before wider release"],
    cross_border_constraints: ["Intelligence sharing agreements and caveats apply"],
    required_controls: ["Compartmentalization", "mission partner controls"],
    permitted_uses: ["Authorized intelligence missions"],
    citations: [{ type: "IC", ref: "ICD 503", source_url: "https://www.dni.gov" }]
  },
  {
    id: "tempest-emissions",
    name: "TEMPEST/emissions data",
    description: "Emanations security specifications, assessments, and protective controls.",
    boundary_conditions: "Includes technical data related to compromising emanations and shielding methods.",
    jurisdiction_protections: {
      US: {
        regime: ["NSTISSAM TEMPEST/1-92"],
        tier: "restricted",
        controls: ["Shielding certification", "distance controls", "inspection"]
      },
      NATO: {
        regime: ["NATO SDIP-27"],
        tier: "restricted",
        controls: ["TEMPEST zoning", "certified equipment"]
      }
    },
    deidentification_requirements: ["Technical specifics generally restricted"],
    cross_border_constraints: ["Controlled transfer with authority approval"],
    required_controls: ["Facility TEMPEST program"],
    permitted_uses: ["Authorized secure facility operation"],
    citations: [{ type: "NATO", ref: "SDIP-27", source_url: "https://nso.nato.int" }]
  },
  {
    id: "program-protection",
    name: "Program protection data",
    description: "Critical Program Information and associated protection strategy artifacts.",
    boundary_conditions: "Includes threat, vulnerability, and countermeasure details for critical technologies.",
    jurisdiction_protections: {
      US: {
        regime: ["DoDI 5200.39", "Program protection guidance"],
        tier: "restricted",
        controls: ["CPI registry", "SCRM controls", "anti-tamper planning"]
      }
    },
    deidentification_requirements: ["Sanitize only with program security authority approval"],
    cross_border_constraints: ["Controlled release case-by-case"],
    required_controls: ["PPP artifact controls", "secure collaboration controls"],
    permitted_uses: ["Program security and mission assurance"],
    citations: [{ type: "DODI", ref: "5200.39", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  },
  {
    id: "supply-chain-data",
    name: "Supply chain data",
    description: "Subcontractor profiles, parts provenance, and security flowdown evidence.",
    boundary_conditions: "Includes supplier security status, origin, and contractual control data.",
    jurisdiction_protections: {
      US: {
        regime: ["NISPOM", "DFARS 252.204-7012", "DFARS 252.246-7008"],
        tier: "high",
        controls: ["Supplier due diligence", "counterfeit detection", "CMMC flowdown"]
      },
      EU: {
        regime: ["Member-state defense procurement security obligations"],
        tier: "high",
        controls: ["Supplier trust and assurance", "export compliance"]
      }
    },
    deidentification_requirements: ["Vendor identifiers can be pseudonymized for analytics"],
    cross_border_constraints: ["Export and contract flowdown requirements apply"],
    required_controls: ["Supplier security monitoring", "provenance tracking"],
    permitted_uses: ["Program procurement and assurance"],
    citations: [{ type: "DFARS", ref: "252.246-7008", source_url: "https://www.acquisition.gov/dfars" }]
  }
];

function dedupeArray(values) {
  return Array.from(new Set((values || []).map((value) => String(value))));
}

function deriveEuTemplate(protections) {
  if (protections.EU) {
    return protections.EU;
  }

  for (const code of EU_MEMBER_STATE_CODES) {
    if (protections[code]) {
      return protections[code];
    }
  }

  if (protections.US) {
    return {
      regime: dedupeArray([...(protections.US.regime || []), "EU member-state implementation requirements"]),
      tier: protections.US.tier || "high",
      controls: dedupeArray(protections.US.controls || [])
    };
  }

  const firstProtection = Object.values(protections)[0];
  if (firstProtection) {
    return {
      regime: dedupeArray([...(firstProtection.regime || []), "EU member-state implementation requirements"]),
      tier: firstProtection.tier || "high",
      controls: dedupeArray(firstProtection.controls || [])
    };
  }

  return null;
}

function ensureEuAndUsCoverageOnDataCategories(categories) {
  for (const category of categories) {
    const protections = category.jurisdiction_protections || {};
    const euTemplate = deriveEuTemplate(protections);

    if (!protections.EU && euTemplate) {
      protections.EU = {
        regime: dedupeArray([...(euTemplate.regime || []), "EU member-state implementation requirements"]),
        tier: euTemplate.tier || "high",
        controls: dedupeArray(euTemplate.controls || [])
      };
    }

    if (protections.EU) {
      for (const code of EU_MEMBER_STATE_CODES) {
        if (!protections[code]) {
          protections[code] = {
            regime: dedupeArray([...(protections.EU.regime || []), `${code} national implementation required`]),
            tier: protections.EU.tier || "high",
            controls: dedupeArray(protections.EU.controls || [])
          };
        }
      }
    }

    if (!protections.US) {
      const usTemplate = protections["US-*"] || protections.US || null;
      if (usTemplate) {
        protections.US = {
          regime: dedupeArray(usTemplate.regime || []),
          tier: usTemplate.tier || "high",
          controls: dedupeArray(usTemplate.controls || [])
        };
      }
    }

    category.jurisdiction_protections = protections;
  }
}

ensureEuAndUsCoverageOnDataCategories(dataCategories);

function deriveNatoTemplate(protections) {
  if (protections.NATO) {
    return protections.NATO;
  }

  for (const code of NATO_MEMBER_CODES) {
    if (protections[code]) {
      return protections[code];
    }
  }

  if (protections.EU) {
    return {
      regime: dedupeArray([...(protections.EU.regime || []), "NATO member-state security implementation requirements"]),
      tier: protections.EU.tier || "high",
      controls: dedupeArray([...(protections.EU.controls || []), "NATO caveat and dissemination enforcement"])
    };
  }

  if (protections.US) {
    return {
      regime: dedupeArray([...(protections.US.regime || []), "NATO alliance handling requirements"]),
      tier: protections.US.tier || "high",
      controls: dedupeArray([...(protections.US.controls || []), "NATO caveat and dissemination enforcement"])
    };
  }

  const firstProtection = Object.values(protections)[0];
  if (firstProtection) {
    return {
      regime: dedupeArray([...(firstProtection.regime || []), "NATO member-state security implementation requirements"]),
      tier: firstProtection.tier || "high",
      controls: dedupeArray([...(firstProtection.controls || []), "NATO caveat and dissemination enforcement"])
    };
  }

  return null;
}

function ensureNatoCoverageOnDataCategories(categories) {
  for (const category of categories) {
    const protections = category.jurisdiction_protections || {};
    const natoTemplate = deriveNatoTemplate(protections);
    if (!natoTemplate) {
      category.jurisdiction_protections = protections;
      continue;
    }

    if (!protections.NATO) {
      protections.NATO = {
        regime: dedupeArray([...(natoTemplate.regime || []), "NATO baseline handling requirements"]),
        tier: natoTemplate.tier || "high",
        controls: dedupeArray(natoTemplate.controls || [])
      };
    }

    for (const code of NATO_MEMBER_CODES) {
      if (!protections[code]) {
        protections[code] = {
          regime: dedupeArray([...(protections.NATO.regime || []), `${code} national implementation required`]),
          tier: protections.NATO.tier || "high",
          controls: dedupeArray(protections.NATO.controls || [])
        };
      }
    }

    category.jurisdiction_protections = protections;
  }
}

ensureNatoCoverageOnDataCategories(dataCategories);

function toTitleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function buildEuCountryCodeToNameMap() {
  const reverse = {};
  for (const [name, code] of Object.entries(EU_COUNTRY_NAME_TO_CODE)) {
    if (!reverse[code] || name.length < reverse[code].length) {
      reverse[code] = name;
    }
  }
  return reverse;
}

function buildJurisdictionProfiles() {
  const euNamesByCode = buildEuCountryCodeToNameMap();
  const euNatoSet = new Set(EU_NATO_MEMBER_CODES);
  const natoSet = new Set(NATO_MEMBER_CODES);
  const euSet = new Set(EU_MEMBER_STATE_CODES);
  const natoNamesByCode = {};
  for (const [name, code] of Object.entries(NATO_COUNTRY_NAME_TO_CODE)) {
    if (!natoNamesByCode[code] || name.length < natoNamesByCode[code].length) {
      natoNamesByCode[code] = name;
    }
  }
  const profiles = [
    {
      id: "jur-eu",
      jurisdiction: "EU",
      display_name: "European Union",
      region: "EU",
      coverage_level: "full",
      eu_member: true,
      nato_member: false,
      member_states: EU_MEMBER_STATE_CODES,
      baseline_obligations: ["NIS2_DIRECTIVE_2022_2555", "EU_DUAL_USE", "EUCI_HANDLING"],
      incident_reporting_model: [
        "NIS2 early warning within 24 hours",
        "NIS2 incident notification within 72 hours",
        "NIS2 final report within one month"
      ],
      national_overlay_guidance:
        "Member-state implementations and authority procedures apply in addition to EU baseline obligations.",
      foundation_join_hints: [
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "NIS2_DIRECTIVE_2022_2555", article: "21" } },
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "NIS2_DIRECTIVE_2022_2555", article: "23" } },
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "EU_DUAL_USE", article: "3" } },
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "EUCI_HANDLING", article: "2013/488/EU" } }
      ],
      knowledge_tier: "authoritative",
      citations: [
        { type: "EU", ref: "Directive (EU) 2022/2555", source_url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj" },
        { type: "EU", ref: "Regulation (EU) 2021/821", source_url: "https://eur-lex.europa.eu/eli/reg/2021/821/oj" },
        { type: "EU", ref: "Council Decision 2013/488/EU", source_url: "https://eur-lex.europa.eu/eli/dec/2013/488/oj" }
      ],
      last_verified: LAST_UPDATED
    },
    {
      id: "jur-nato",
      jurisdiction: "NATO",
      display_name: "NATO Alliance",
      region: "NATO",
      coverage_level: "focused",
      eu_member: false,
      nato_member: true,
      member_states: NATO_MEMBER_CODES,
      baseline_obligations: ["NATO_C_M_2002_49", "NATO_FSC_HANDLING", "NATO_STANAG_4774", "NATO_STANAG_4778"],
      incident_reporting_model: [
        "Immediate classified incident reporting through national security authority channels",
        "Originator control and coalition dissemination caveat enforcement"
      ],
      national_overlay_guidance:
        "NATO security policy is implemented through national security authorities and bilateral/multilateral agreements.",
      foundation_join_hints: [
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "NATO_C_M_2002_49", article: "security principles" } },
        { mcp: "security-controls", tool: "get_control", params: { framework: "nato_stanag_4774", control: "label syntax" } },
        { mcp: "security-controls", tool: "get_control", params: { framework: "nato_stanag_4778", control: "metadata binding" } }
      ],
      knowledge_tier: "authoritative",
      citations: [
        { type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" },
        { type: "NATO", ref: "STANAG 4774", source_url: "https://nso.nato.int" },
        { type: "NATO", ref: "STANAG 4778", source_url: "https://nso.nato.int" }
      ],
      last_verified: LAST_UPDATED
    },
    {
      id: "jur-us",
      jurisdiction: "US",
      display_name: "United States (Federal)",
      region: "US",
      coverage_level: "minimum",
      eu_member: false,
      nato_member: true,
      member_states: US_STATE_CODES.map((code) => `US-${code}`),
      baseline_obligations: ["CMMC_2_0", "DFARS_252.204-7012", "ITAR_22_CFR_120_130", "EAR_15_CFR_730_774"],
      incident_reporting_model: [
        "DFARS cyber incident reporting within 72 hours for covered defense information",
        "Evidence preservation for DoD damage assessment support"
      ],
      national_overlay_guidance:
        "Federal defense obligations apply nationwide; state-specific notification and privacy overlays may add additional requirements.",
      foundation_join_hints: [
        { mcp: "us-regulations", tool: "get_section", params: { regulation: "DFARS_252.204-7012", section: "(d)" } },
        { mcp: "us-regulations", tool: "get_section", params: { regulation: "CMMC_2_0", section: "Level 2" } },
        { mcp: "us-law", tool: "get_provision", params: { regulation: "ITAR_22_CFR_120_130", section: "120-130" } },
        { mcp: "us-law", tool: "get_provision", params: { regulation: "EAR_15_CFR_730_774", section: "730-774" } }
      ],
      knowledge_tier: "authoritative",
      citations: [
        { type: "CFR", ref: "32 CFR Part 170", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-170" },
        { type: "DFARS", ref: "252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" },
        { type: "CFR", ref: "22 CFR 120-130", source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M" },
        { type: "CFR", ref: "15 CFR 730-774", source_url: "https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C" }
      ],
      last_verified: LAST_UPDATED
    },
    {
      id: "jur-uk",
      jurisdiction: "UK",
      display_name: "United Kingdom",
      region: "NATO",
      coverage_level: "full",
      eu_member: false,
      nato_member: true,
      baseline_obligations: [
        "UK_DEFSTAN_05_138",
        "UK_CYBER_ESSENTIALS_PLUS",
        "UK_OSA_2023",
        "NATO_C_M_2002_49",
        "NATO_STANAG_4774",
        "NATO_STANAG_4778"
      ],
      incident_reporting_model: [
        "NCSC incident reporting for defence-related cyber incidents",
        "Immediate classified incident reporting through UK national security authority",
        "MoD contract-specific notification obligations"
      ],
      national_overlay_guidance:
        "UK MoD procurement requires Def Stan 05-138 compliance and Cyber Essentials Plus certification. Post-Brexit, UK is not subject to NIS2 or EU Dual-Use Regulation but maintains own export control and security frameworks. AUKUS and Five Eyes obligations may apply to specific programs.",
      foundation_join_hints: [
        { mcp: "security-controls", tool: "get_control", params: { framework: "uk_defstan_05_138", control: "baseline" } },
        { mcp: "security-controls", tool: "get_control", params: { framework: "nato_stanag_4774", control: "label syntax" } },
        { mcp: "security-controls", tool: "get_control", params: { framework: "nato_stanag_4778", control: "metadata binding" } }
      ],
      knowledge_tier: "authoritative",
      citations: [
        { type: "UK", ref: "Def Stan 05-138", source_url: "https://www.dstan.mod.uk" },
        { type: "UK", ref: "Cyber Essentials Plus", source_url: "https://www.ncsc.gov.uk/cyberessentials/overview" },
        { type: "UK", ref: "Official Secrets Act 2023", source_url: "https://www.legislation.gov.uk/ukpga/2023/32/contents" },
        { type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }
      ],
      last_verified: LAST_UPDATED
    }
  ];

  for (const countryCode of EU_MEMBER_STATE_CODES) {
    const displayName = toTitleCase(euNamesByCode[countryCode] || countryCode);
    profiles.push({
      id: `jur-eu-${countryCode.toLowerCase()}`,
      jurisdiction: countryCode,
      display_name: displayName,
      region: "EU",
      coverage_level: "full",
      eu_member: true,
      nato_member: euNatoSet.has(countryCode),
      baseline_obligations: ["NIS2_DIRECTIVE_2022_2555", "EU_DUAL_USE", "EUCI_HANDLING"],
      incident_reporting_model: [
        "NIS2 early warning within 24 hours",
        "NIS2 incident notification within 72 hours",
        "NIS2 final report within one month"
      ],
      national_overlay_guidance: `${displayName} national security authority implementation and procurement controls apply to defense programs.`,
      foundation_join_hints: [
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "NIS2_DIRECTIVE_2022_2555", article: "21" } },
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "NIS2_DIRECTIVE_2022_2555", article: "23" } },
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "EU_DUAL_USE", article: "3" } }
      ],
      knowledge_tier: "inferred",
      citations: [
        { type: "EU", ref: "Directive (EU) 2022/2555", source_url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj" },
        { type: "EU", ref: "Regulation (EU) 2021/821", source_url: "https://eur-lex.europa.eu/eli/reg/2021/821/oj" }
      ],
      last_verified: LAST_UPDATED
    });
  }

  for (const stateCode of US_STATE_CODES) {
    profiles.push({
      id: `jur-us-${stateCode.toLowerCase()}`,
      jurisdiction: `US-${stateCode}`,
      display_name: `United States (${stateCode})`,
      region: "US",
      coverage_level: "minimum",
      eu_member: false,
      nato_member: false,
      baseline_obligations: ["CMMC_2_0", "DFARS_252.204-7012"],
      incident_reporting_model: [
        "DFARS cyber incident reporting within 72 hours for covered defense information",
        "Contractual flowdown and reporting obligations to prime/agency"
      ],
      national_overlay_guidance:
        "Federal defense obligations apply. Evaluate state-level breach/privacy obligations when non-federal data is impacted.",
      foundation_join_hints: [
        { mcp: "us-regulations", tool: "get_section", params: { regulation: "DFARS_252.204-7012", section: "(d)" } },
        { mcp: "us-regulations", tool: "get_section", params: { regulation: "CMMC_2_0", section: "Level 2" } }
      ],
      knowledge_tier: "inferred",
      citations: [
        { type: "DFARS", ref: "252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" },
        { type: "CFR", ref: "32 CFR Part 170", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-170" }
      ],
      last_verified: LAST_UPDATED
    });
  }

  for (const countryCode of NATO_MEMBER_CODES) {
    if (countryCode === "US" || euSet.has(countryCode)) {
      continue;
    }
    const displayName = toTitleCase(natoNamesByCode[countryCode] || countryCode);
    profiles.push({
      id: `jur-nato-${countryCode.toLowerCase()}`,
      jurisdiction: countryCode,
      display_name: displayName,
      region: "NATO",
      coverage_level: "focused",
      eu_member: euSet.has(countryCode),
      nato_member: natoSet.has(countryCode),
      baseline_obligations: ["NATO_C_M_2002_49", "NATO_FSC_HANDLING", "NATO_STANAG_4774", "NATO_STANAG_4778"],
      incident_reporting_model: [
        "Immediate classified incident reporting through national security authority channels",
        "Coordinate coalition notifications with originating authority"
      ],
      national_overlay_guidance:
        `${displayName} national security authority controls determine local implementation of NATO obligations.`,
      foundation_join_hints: [
        { mcp: "eu-regulations", tool: "get_article", params: { regulation: "NATO_C_M_2002_49", article: "security principles" } },
        { mcp: "security-controls", tool: "get_control", params: { framework: "nato_stanag_4774", control: "label syntax" } },
        { mcp: "security-controls", tool: "get_control", params: { framework: "nato_stanag_4778", control: "metadata binding" } }
      ],
      knowledge_tier: "inferred",
      citations: [
        { type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" },
        { type: "NATO", ref: "STANAG 4774", source_url: "https://nso.nato.int" }
      ],
      last_verified: LAST_UPDATED
    });
  }

  return profiles;
}

const jurisdictionProfiles = buildJurisdictionProfiles();

const threatScenarios = [
  {
    id: "da-threat-apt-dib",
    name: "APT campaign targeting defense industrial base",
    category: "nation-state",
    description: "Persistent adversary conducts credential theft, lateral movement, and covert exfiltration targeting controlled defense data.",
    attack_narrative:
      "Adversary compromises supplier endpoint, moves into CUI enclave, stages exfiltration over encrypted C2 channel, and removes technical package data.",
    mitre_mapping: ["T1078", "T1027", "T1041", "T1199"],
    affected_patterns: ["da-cui-environment", "da-supply-chain", "da-dev-secure"],
    affected_data_categories: ["cui", "supply-chain-data", "program-protection"],
    likelihood_factors: {
      prevalence: "high",
      attacker_motivation: "high",
      difficulty: "moderate"
    },
    impact_dimensions: {
      mission: "high",
      financial: "high",
      regulatory: "high",
      reputational: "high",
      safety: "medium"
    },
    severity: "critical",
    regulation_refs: [
      { regulation_id: "DFARS_252.204-7012", section: "(c)-(d)", foundation_mcp: "us-regulations" },
      { regulation_id: "CMMC_2_0", section: "Level 2", foundation_mcp: "us-regulations" }
    ],
    control_refs: ["NIST.800-171.3.1.1", "NIST.800-171.3.3.1", "NIST.800-171.3.6.1"],
    detection_indicators: ["Impossible-travel admin logins", "Bulk archive staging", "Unexpected outbound encrypted tunnels"],
    historical_incidents: ["Public reporting on DIB espionage campaigns"],
    citations: [{ type: "CFR", ref: "DFARS 252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" }]
  },
  {
    id: "da-threat-counterfeit-parts",
    name: "Counterfeit parts insertion",
    category: "supply-chain",
    description: "Malicious or substandard components enter defense supply chain and degrade mission assurance.",
    attack_narrative:
      "Compromised broker injects counterfeit microelectronics with latent failure characteristics; provenance controls are bypassed during acceptance.",
    mitre_mapping: ["T1195.002", "T1588"],
    affected_patterns: ["da-supply-chain", "da-weapons-system"],
    affected_data_categories: ["supply-chain-data", "weapons-system-data"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "high",
      difficulty: "high"
    },
    impact_dimensions: {
      mission: "critical",
      financial: "high",
      regulatory: "high",
      reputational: "high",
      safety: "critical"
    },
    severity: "critical",
    regulation_refs: [
      { regulation_id: "DFARS_252.246-7008", section: "all", foundation_mcp: "us-regulations" },
      { regulation_id: "DoDI_4140.67", section: "counterfeit prevention", foundation_mcp: "us-regulations" }
    ],
    control_refs: ["SCRM-1", "SCRM-2", "CM-8"],
    detection_indicators: ["Serialization mismatches", "Unverified chain-of-custody", "Unexpected failure clustering"],
    historical_incidents: ["GAO and DoD reporting on counterfeit defense parts"],
    citations: [{ type: "DFARS", ref: "252.246-7008", source_url: "https://www.acquisition.gov/dfars" }]
  },
  {
    id: "da-threat-classification-spillage",
    name: "Classification spillage across domains",
    category: "classified-environment",
    description: "Data of higher classification is transferred to lower-domain systems without authorized downgrade.",
    attack_narrative:
      "Analyst exports mislabeled artifact from classified enclave into CUI environment via misconfigured CDS policy.",
    mitre_mapping: ["T1565", "T1020"],
    affected_patterns: ["da-classified-enclave", "da-c2"],
    affected_data_categories: ["nato-classified", "national-classified", "eu-classified"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "medium",
      difficulty: "moderate"
    },
    impact_dimensions: {
      mission: "high",
      financial: "medium",
      regulatory: "critical",
      reputational: "high",
      safety: "medium"
    },
    severity: "high",
    regulation_refs: [
      { regulation_id: "NISPOM_32_CFR_117", section: "classified handling", foundation_mcp: "us-regulations" },
      { regulation_id: "NATO_C_M_2002_49", section: "security principles", foundation_mcp: "eu-regulations" }
    ],
    control_refs: ["AC-4", "MP-4", "SC-7"],
    detection_indicators: ["Downgrade logs with missing approvals", "Label mismatch alerts"],
    historical_incidents: ["Publicly reported classified spill events in coalition operations"],
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  },
  {
    id: "da-threat-weapon-exploitation",
    name: "Mission system software exploitation",
    category: "weapons-system",
    description: "Adversary exploits vulnerabilities in mission software to alter behavior or degrade system availability.",
    attack_narrative:
      "Threat actor exploits unpatched embedded component, modifies control logic, and causes mission degradation during operation.",
    mitre_mapping: ["T1203", "T1609", "T0831"],
    affected_patterns: ["da-weapons-system", "da-uav"],
    affected_data_categories: ["weapons-system-data", "program-protection"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "high",
      difficulty: "high"
    },
    impact_dimensions: {
      mission: "critical",
      financial: "high",
      regulatory: "high",
      reputational: "high",
      safety: "critical"
    },
    severity: "critical",
    regulation_refs: [
      { regulation_id: "MIL_STD_882", section: "hazard analysis", foundation_mcp: "security-controls" },
      { regulation_id: "DoDI_8510.01", section: "RMF", foundation_mcp: "us-regulations" },
      { regulation_id: "DO_326A", section: "airworthiness cyber", foundation_mcp: "security-controls" }
    ],
    control_refs: ["RA-5", "SI-2", "SA-11"],
    detection_indicators: ["Integrity check failures", "Unexpected command execution paths", "Anomalous actuator outputs"],
    historical_incidents: ["Open-source reporting on military platform cyber test findings"],
    citations: [{ type: "MIL", ref: "MIL-STD-882", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "da-threat-itar-cloud-transfer",
    name: "ITAR violation via cloud misconfiguration",
    category: "supply-chain",
    description: "ITAR technical data is exposed through misconfigured cloud storage or unauthorized foreign-admin access.",
    attack_narrative:
      "Engineering repository with ITAR technical package is replicated to global storage region with foreign support personnel access.",
    mitre_mapping: ["T1530", "T1078", "T1114"],
    affected_patterns: ["da-dev-secure", "da-mil-cloud", "da-supply-chain"],
    affected_data_categories: ["itar-controlled", "program-protection"],
    likelihood_factors: {
      prevalence: "high",
      attacker_motivation: "medium",
      difficulty: "low"
    },
    impact_dimensions: {
      mission: "high",
      financial: "high",
      regulatory: "critical",
      reputational: "high",
      safety: "medium"
    },
    severity: "critical",
    regulation_refs: [
      { regulation_id: "ITAR_22_CFR_120_130", section: "technical data export", foundation_mcp: "us-law" },
      { regulation_id: "EAR_deemed_export", section: "734.13", foundation_mcp: "us-law" }
    ],
    control_refs: ["SC-28", "AC-3", "CM-6", "CP-9"],
    detection_indicators: ["Unexpected geo replication", "Foreign-admin support ticket access", "Unapproved data egress events"],
    historical_incidents: ["Export enforcement notices involving cloud data handling"],
    citations: [{ type: "CFR", ref: "22 CFR 120-130", source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M" }]
  },
  {
    id: "da-threat-insider-cleared",
    name: "Insider threat from cleared personnel",
    category: "nation-state",
    description: "Authorized insider abuses privileged access to remove or disclose controlled information.",
    attack_narrative:
      "Privileged analyst bypasses monitoring window and exfiltrates CPI-related documentation to unauthorized media.",
    mitre_mapping: ["T1078", "T1056", "T1005"],
    affected_patterns: ["da-classified-enclave", "da-cui-environment", "da-isr"],
    affected_data_categories: ["cui", "nato-classified", "program-protection"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "medium",
      difficulty: "moderate"
    },
    impact_dimensions: {
      mission: "high",
      financial: "medium",
      regulatory: "high",
      reputational: "high",
      safety: "medium"
    },
    severity: "high",
    regulation_refs: [
      { regulation_id: "NISPOM_32_CFR_117", section: "personnel security", foundation_mcp: "us-regulations" }
    ],
    control_refs: ["AU-6", "AC-6", "PS-3"],
    detection_indicators: ["Off-hours access spikes", "Atypical media write events"],
    historical_incidents: ["Well-documented insider leak cases"],
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  },
  {
    id: "da-threat-cds-exploitation",
    name: "Cross-domain solution exploitation",
    category: "classified-environment",
    description: "Adversary exploits or misuses CDS policy to move data/commands between security domains.",
    attack_narrative:
      "Crafted payload abuses insufficient content filtering in CDS to pass prohibited content into higher assurance environment.",
    mitre_mapping: ["T1190", "T1565", "T1027"],
    affected_patterns: ["da-classified-enclave", "da-c2", "da-mil-cloud"],
    affected_data_categories: ["nato-classified", "national-classified", "eu-classified"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "high",
      difficulty: "high"
    },
    impact_dimensions: {
      mission: "critical",
      financial: "medium",
      regulatory: "critical",
      reputational: "high",
      safety: "high"
    },
    severity: "critical",
    regulation_refs: [
      { regulation_id: "NATO_C_M_2002_49", section: "cross-domain exchange", foundation_mcp: "eu-regulations" },
      { regulation_id: "CNSSI_1253", section: "boundary protection", foundation_mcp: "security-controls" }
    ],
    control_refs: ["SC-7", "SC-18", "SI-4"],
    detection_indicators: ["Policy bypass alerts", "Unexpected transfer class mismatches"],
    historical_incidents: ["CDS vulnerability advisories"],
    citations: [{ type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }]
  },
  {
    id: "da-threat-gps-spoofing",
    name: "GPS/PNT spoofing and denial",
    category: "weapons-system",
    description: "Adversary jams or spoofs navigation timing affecting mission execution.",
    attack_narrative:
      "RF adversary transmits forged PNT signals causing UAV and tactical systems to drift off-course.",
    mitre_mapping: ["T0880", "T0814"],
    affected_patterns: ["da-uav", "da-weapons-system", "da-tactical-network"],
    affected_data_categories: ["weapons-system-data"],
    likelihood_factors: {
      prevalence: "high",
      attacker_motivation: "high",
      difficulty: "moderate"
    },
    impact_dimensions: {
      mission: "critical",
      financial: "medium",
      regulatory: "medium",
      reputational: "high",
      safety: "critical"
    },
    severity: "critical",
    regulation_refs: [
      { regulation_id: "MIL_STD_882", section: "safety assurance", foundation_mcp: "security-controls" }
    ],
    control_refs: ["SC-40", "SI-7", "RA-3"],
    detection_indicators: ["PNT anomaly divergence", "Signal quality degradation patterns"],
    historical_incidents: ["Public incidents of GNSS spoofing in contested zones"],
    citations: [{ type: "MIL", ref: "MIL-STD-882", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "da-threat-electronic-warfare",
    name: "Electronic warfare and signal exploitation",
    category: "weapons-system",
    description: "Adversary performs RF interception, jamming, and exploitation against tactical networks.",
    attack_narrative:
      "Signals intelligence unit captures and analyzes tactical waveform patterns to disrupt operations and extract metadata.",
    mitre_mapping: ["T0886", "T0883"],
    affected_patterns: ["da-tactical-network", "da-c2"],
    affected_data_categories: ["intelligence-data", "weapons-system-data"],
    likelihood_factors: {
      prevalence: "high",
      attacker_motivation: "high",
      difficulty: "high"
    },
    impact_dimensions: {
      mission: "critical",
      financial: "medium",
      regulatory: "medium",
      reputational: "high",
      safety: "high"
    },
    severity: "high",
    regulation_refs: [
      { regulation_id: "NATO_SDIP_27", section: "emanations and signal protection", foundation_mcp: "security-controls" }
    ],
    control_refs: ["SC-40", "SC-8", "CP-2"],
    detection_indicators: ["RF interference spikes", "Command latency anomalies"],
    historical_incidents: ["Open-source EW disruption events"],
    citations: [{ type: "NATO", ref: "SDIP-27", source_url: "https://nso.nato.int" }]
  },
  {
    id: "da-threat-autonomy-hijack",
    name: "Autonomous system hijacking",
    category: "weapons-system",
    description: "Adversary manipulates autonomy stack behavior in unmanned or semi-autonomous defense platforms.",
    attack_narrative:
      "Compromised model update introduces adversarial behavior in mission planner causing unsafe path selection.",
    mitre_mapping: ["T0832", "T1609"],
    affected_patterns: ["da-uav", "da-weapons-system", "da-dev-secure"],
    affected_data_categories: ["weapons-system-data", "program-protection"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "high",
      difficulty: "high"
    },
    impact_dimensions: {
      mission: "critical",
      financial: "high",
      regulatory: "high",
      reputational: "high",
      safety: "critical"
    },
    severity: "critical",
    regulation_refs: [
      { regulation_id: "DO_326A", section: "airworthiness cybersecurity process", foundation_mcp: "security-controls" },
      { regulation_id: "DO_356A", section: "security methods", foundation_mcp: "security-controls" }
    ],
    control_refs: ["SA-11", "SI-7", "CM-14"],
    detection_indicators: ["Model integrity mismatch", "Control law drift"],
    historical_incidents: ["Demonstrated autonomous control attacks in research"],
    citations: [{ type: "RTCA", ref: "DO-356A", source_url: "https://www.rtca.org" }]
  },
  {
    id: "da-threat-tempest-exploitation",
    name: "TEMPEST emanations exploitation",
    category: "classified-environment",
    description: "Adversary captures compromising emanations from unshielded equipment to infer sensitive content.",
    attack_narrative:
      "Collection team positions near insecure workspace and reconstructs displayed information from RF emanations.",
    mitre_mapping: ["T0820"],
    affected_patterns: ["da-classified-enclave", "da-c2"],
    affected_data_categories: ["tempest-emissions", "national-classified"],
    likelihood_factors: {
      prevalence: "low",
      attacker_motivation: "high",
      difficulty: "high"
    },
    impact_dimensions: {
      mission: "high",
      financial: "low",
      regulatory: "high",
      reputational: "high",
      safety: "medium"
    },
    severity: "high",
    regulation_refs: [
      { regulation_id: "NSTISSAM_TEMPEST_1_92", section: "all", foundation_mcp: "security-controls" },
      { regulation_id: "NATO_SDIP_27", section: "all", foundation_mcp: "security-controls" }
    ],
    control_refs: ["PE-18", "SC-8", "SC-39"],
    detection_indicators: ["TEMPEST inspection failures", "Unauthorized near-field RF activity"],
    historical_incidents: ["Historical TEMPEST exploitation research"],
    citations: [{ type: "NATO", ref: "SDIP-27", source_url: "https://nso.nato.int" }]
  },
  {
    id: "da-threat-removable-media",
    name: "Removable media compromise in air-gapped environments",
    category: "classified-environment",
    description: "Malware introduced through removable media bypasses network segmentation in restricted environments.",
    attack_narrative:
      "Contractor transfers approved update package via USB; malicious implant executes and stages lateral movement in enclave.",
    mitre_mapping: ["T1091", "T1204"],
    affected_patterns: ["da-classified-enclave", "da-dev-secure"],
    affected_data_categories: ["national-classified", "cui"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "high",
      difficulty: "moderate"
    },
    impact_dimensions: {
      mission: "high",
      financial: "medium",
      regulatory: "high",
      reputational: "high",
      safety: "medium"
    },
    severity: "high",
    regulation_refs: [
      { regulation_id: "NISPOM_32_CFR_117", section: "media controls", foundation_mcp: "us-regulations" }
    ],
    control_refs: ["MP-7", "SI-3", "AC-19"],
    detection_indicators: ["Unauthorized media mount events", "Endpoint malware alert in isolated segment"],
    historical_incidents: ["Notable removable-media campaigns against air-gapped systems"],
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  },
  {
    id: "da-threat-foci-influence",
    name: "Foreign ownership, control, or influence (FOCI) exploitation",
    category: "supply-chain",
    description: "Adversary leverages ownership or influence channels to access controlled program information.",
    attack_narrative:
      "Influenced subcontractor governance decisions weaken access controls and permit covert data transfer to foreign parent entity.",
    mitre_mapping: ["T1199", "T1589"],
    affected_patterns: ["da-supply-chain", "da-cui-environment"],
    affected_data_categories: ["supply-chain-data", "cui", "itar-controlled"],
    likelihood_factors: {
      prevalence: "medium",
      attacker_motivation: "high",
      difficulty: "moderate"
    },
    impact_dimensions: {
      mission: "high",
      financial: "high",
      regulatory: "critical",
      reputational: "high",
      safety: "medium"
    },
    severity: "high",
    regulation_refs: [
      { regulation_id: "NISPOM_FOCI", section: "FOCI mitigation", foundation_mcp: "us-regulations" },
      { regulation_id: "ITAR_22_CFR_120_130", section: "foreign person restrictions", foundation_mcp: "us-law" }
    ],
    control_refs: ["PS-7", "AC-3", "AT-2"],
    detection_indicators: ["Unusual foreign access requests", "Governance exception patterns"],
    historical_incidents: ["Public FOCI enforcement and mitigation cases"],
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  }
];

const technicalStandards = [
  {
    id: "NIST_SP_800_171",
    name: "NIST SP 800-171",
    version: "Rev.3 (published 2024-05-14)",
    publisher: "NIST",
    scope: "Protecting CUI in non-federal systems",
    key_clauses: ["14 control families", "Rev.3 requirements set", "CMMC currently aligns to Rev.2 requirements pending rule updates"],
    control_mappings: [
      { framework: "cmmc_2_0", control: "L2" },
      { framework: "iso_27001_2022", control: "A.5-A.8 mapping" }
    ],
    regulation_mappings: [
      { regulation_id: "CMMC_2_0", section: "Level 2" },
      { regulation_id: "DFARS_252.204-7012", section: "(b)" }
    ],
    implementation_guidance: "Use CUI scoping, SSP boundary definition, and evidence-driven control testing.",
    licensing_restrictions: "Public domain",
    citations: [{ type: "NIST", ref: "SP 800-171 Rev.3", source_url: "https://csrc.nist.gov/pubs/sp/800/171/r3/final" }]
  },
  {
    id: "CMMC_2_0",
    name: "CMMC 2.0",
    version: "2.0 codified in 32 CFR Part 170; DFARS implementation effective 2025-11-10",
    publisher: "DoD",
    scope: "Cybersecurity maturity for DIB contracts (Levels 1-3)",
    key_clauses: ["Level 1 (17)", "Level 2 (110)", "Level 3 (110+24)"],
    control_mappings: [
      { framework: "nist_sp_800_171", control: "all L2 practices" },
      { framework: "nist_sp_800_172", control: "L3 enhancements" }
    ],
    regulation_mappings: [
      { regulation_id: "32_CFR_PART_170", section: "all" },
      { regulation_id: "DFARS_SUBPART_204_75", section: "all" },
      { regulation_id: "DFARS_252.204-7021", section: "all" },
      { regulation_id: "DFARS_252.204-7012", section: "reporting tie-in" }
    ],
    implementation_guidance: "Map contract requirements to level, assessment route, and POA&M constraints.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "CFR", ref: "32 CFR Part 170", source_url: "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program" }]
  },
  {
    id: "NIST_SP_800_172",
    name: "NIST SP 800-172",
    version: "Final (2021) + Rev.3 FPD (2025) track",
    publisher: "NIST",
    scope: "Enhanced CUI safeguards for advanced persistent threats",
    key_clauses: ["24 enhanced requirements"],
    control_mappings: [{ framework: "cmmc_2_0", control: "Level 3 enhancements" }],
    regulation_mappings: [{ regulation_id: "CMMC_2_0", section: "Level 3" }],
    implementation_guidance: "Prioritize advanced detection, resilience, and adversary-focused protections.",
    licensing_restrictions: "Public domain",
    citations: [{ type: "NIST", ref: "SP 800-172", source_url: "https://csrc.nist.gov/pubs/sp/800/172/final" }]
  },
  {
    id: "NIST_SP_800_161",
    name: "NIST SP 800-161 Rev.1",
    version: "Rev.1 (2022)",
    publisher: "NIST",
    scope: "Cybersecurity supply chain risk management practices for systems and organizations",
    key_clauses: ["enterprise C-SCRM integration", "supplier criticality analysis", "supplier monitoring and response"],
    control_mappings: [
      { framework: "nist_sp_800_53", control: "SR family" },
      { framework: "cmmc_2_0", control: "supplier assurance support" }
    ],
    regulation_mappings: [
      { regulation_id: "DFARS_252.204-7019", section: "SPRS assessment baseline support" },
      { regulation_id: "DFARS_252.204-7020", section: "assessment support obligations" }
    ],
    implementation_guidance:
      "Integrate supplier criticality analysis, contractual controls, and continuous supplier risk monitoring into SSP and POA&M workflows.",
    licensing_restrictions: "Public domain",
    citations: [{ type: "NIST", ref: "SP 800-161 Rev.1", source_url: "https://csrc.nist.gov/pubs/sp/800/161/r1/final" }]
  },
  {
    id: "NIST_SP_800_218",
    name: "NIST SP 800-218 (SSDF)",
    version: "Final (2022)",
    publisher: "NIST",
    scope: "Secure software development framework practices",
    key_clauses: ["Prepare the organization", "Protect the software", "Produce well-secured software", "Respond to vulnerabilities"],
    control_mappings: [
      { framework: "cmmc_2_0", control: "secure development evidence" },
      { framework: "nist_sp_800_53", control: "SA and SI families" }
    ],
    regulation_mappings: [{ regulation_id: "DFARS_252.204-7020", section: "assessment evidence quality" }],
    implementation_guidance:
      "Operationalize SSDF practices in CI/CD with traceable design, code review, testing, and vulnerability response evidence.",
    licensing_restrictions: "Public domain",
    citations: [{ type: "NIST", ref: "SP 800-218", source_url: "https://csrc.nist.gov/pubs/sp/800/218/final" }]
  },
  {
    id: "DFARS_7019_ASSESSMENT",
    name: "DFARS 252.204-7019",
    version: "current",
    publisher: "US DoD",
    scope: "Notice and eligibility requirements for NIST SP 800-171 DoD assessments",
    key_clauses: ["SPRS posting prerequisite", "assessment recency requirement"],
    control_mappings: [{ framework: "cmmc_2_0", control: "assessment readiness pre-award" }],
    regulation_mappings: [{ regulation_id: "DFARS_252.204-7019", section: "all" }],
    implementation_guidance:
      "Ensure current Basic/Medium/High assessment data is posted in SPRS and contractually scoped before proposal submission.",
    licensing_restrictions: "Public guidance",
    citations: [
      {
        type: "DFARS",
        ref: "252.204-7019",
        source_url: "https://www.acquisition.gov/dfars/252.204-7019-notice-nist-sp-800-171-dod-assessment-requirements"
      }
    ]
  },
  {
    id: "DFARS_7020_ASSESSMENT",
    name: "DFARS 252.204-7020",
    version: "current",
    publisher: "US DoD",
    scope: "Contractor support requirements for DoD medium/high cybersecurity assessments",
    key_clauses: ["access to facilities and systems", "records and personnel support"],
    control_mappings: [{ framework: "cmmc_2_0", control: "assessment execution support" }],
    regulation_mappings: [{ regulation_id: "DFARS_252.204-7020", section: "all" }],
    implementation_guidance:
      "Maintain assessment-ready evidence and provide auditable access support for DoD-led validation activities.",
    licensing_restrictions: "Public guidance",
    citations: [
      {
        type: "DFARS",
        ref: "252.204-7020",
        source_url: "https://www.acquisition.gov/dfars/252.204-7020-nist-sp-800-171-dod-assessment-requirements"
      }
    ]
  },
  {
    id: "CNSSI_1253",
    name: "CNSSI 1253",
    version: "current",
    publisher: "CNSS",
    scope: "Security controls for national security systems",
    key_clauses: ["NSS security categorization", "control baseline overlays"],
    control_mappings: [{ framework: "nist_sp_800_53", control: "NSS overlays" }],
    regulation_mappings: [{ regulation_id: "ICD_503", section: "categorization support" }],
    implementation_guidance: "Apply NSS overlays on top of RMF control baselines.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "CNSS", ref: "CNSSI 1253", source_url: "https://www.cnss.gov" }]
  },
  {
    id: "DOD_STIG",
    name: "DoD STIGs",
    version: "rolling",
    publisher: "DISA",
    scope: "Technology-specific hardening baselines",
    key_clauses: ["Product baseline checks", "configuration compliance"],
    control_mappings: [{ framework: "nist_sp_800_53", control: "CM and SI families" }],
    regulation_mappings: [{ regulation_id: "DoDI_8500.01", section: "technical implementation" }],
    implementation_guidance: "Automate STIG benchmark evidence and exception management.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "DOD", ref: "STIG", source_url: "https://public.cyber.mil/stigs/" }]
  },
  {
    id: "NATO_STANAG_4774",
    name: "NATO STANAG 4774",
    version: "Edition current",
    publisher: "NATO",
    scope: "Confidentiality metadata label syntax",
    key_clauses: ["security label attributes", "caveat tagging"],
    control_mappings: [{ framework: "cross-domain", control: "label enforcement" }],
    regulation_mappings: [{ regulation_id: "NATO_C_M_2002_49", section: "information labeling" }],
    implementation_guidance: "Ensure machine-readable labels are preserved across coalition data flows.",
    licensing_restrictions: "Public summary only",
    citations: [{ type: "NATO", ref: "STANAG 4774", source_url: "https://nso.nato.int" }]
  },
  {
    id: "NATO_STANAG_4778",
    name: "NATO STANAG 4778",
    version: "Edition current",
    publisher: "NATO",
    scope: "Metadata binding and integrity",
    key_clauses: ["binding of security metadata to content"],
    control_mappings: [{ framework: "cross-domain", control: "metadata integrity" }],
    regulation_mappings: [{ regulation_id: "NATO_C_M_2002_49", section: "protected dissemination" }],
    implementation_guidance: "Apply label-binding mechanisms for cross-domain and coalition exchange.",
    licensing_restrictions: "Public summary only",
    citations: [{ type: "NATO", ref: "STANAG 4778", source_url: "https://nso.nato.int" }]
  },
  {
    id: "NATO_SDIP_27",
    name: "NATO SDIP-27",
    version: "current",
    publisher: "NATO",
    scope: "TEMPEST standards and zoning",
    key_clauses: ["zone controls", "equipment requirements"],
    control_mappings: [{ framework: "physical-security", control: "PE-18 equivalent" }],
    regulation_mappings: [{ regulation_id: "NATO_C_M_2002_49", section: "emanations security" }],
    implementation_guidance: "Define TEMPEST zone architecture and inspection program.",
    licensing_restrictions: "Public summary only",
    citations: [{ type: "NATO", ref: "SDIP-27", source_url: "https://nso.nato.int" }]
  },
  {
    id: "NATO_STANAG_4586",
    name: "NATO STANAG 4586",
    version: "Edition current",
    publisher: "NATO",
    scope: "UAV control system interoperability interfaces",
    key_clauses: ["common control interface profiles", "interoperable message sets"],
    control_mappings: [{ framework: "coalition-uav", control: "uav c2 interoperability" }],
    regulation_mappings: [{ regulation_id: "NATO_C_M_2002_49", section: "coalition mission interoperability" }],
    implementation_guidance:
      "Standardize UAV command/control interfaces and coalition integration profiles to reduce mission interoperability failures.",
    licensing_restrictions: "Public summary only",
    citations: [{ type: "NATO", ref: "STANAG 4586", source_url: "https://nso.nato.int" }]
  },
  {
    id: "NATO_STANAG_4609",
    name: "NATO STANAG 4609",
    version: "Edition current",
    publisher: "NATO",
    scope: "Digital motion imagery interoperability for ISR",
    key_clauses: ["motion imagery encoding baseline", "imagery metadata interoperability"],
    control_mappings: [{ framework: "coalition-isr", control: "imagery data interoperability" }],
    regulation_mappings: [{ regulation_id: "NATO_C_M_2002_49", section: "coalition ISR dissemination" }],
    implementation_guidance:
      "Use STANAG 4609-aligned imagery and metadata pipelines to ensure coalition ISR consumption and exploitation compatibility.",
    licensing_restrictions: "Public summary only",
    citations: [{ type: "NATO", ref: "STANAG 4609", source_url: "https://nso.nato.int" }]
  },
  {
    id: "NATO_STANAG_5516",
    name: "NATO STANAG 5516",
    version: "Edition current",
    publisher: "NATO",
    scope: "Tactical data exchange interoperability (Link 16)",
    key_clauses: ["message interoperability profile", "tactical data link coordination"],
    control_mappings: [{ framework: "coalition-c2", control: "tactical data link interoperability" }],
    regulation_mappings: [{ regulation_id: "NATO_C_M_2002_49", section: "coalition c2 exchange" }],
    implementation_guidance:
      "Align tactical data link message handling and gateway integration controls for coalition command-and-control operations.",
    licensing_restrictions: "Public summary only",
    citations: [{ type: "NATO", ref: "STANAG 5516", source_url: "https://nso.nato.int" }]
  },
  {
    id: "MIL_STD_882",
    name: "MIL-STD-882",
    version: "latest",
    publisher: "DoD",
    scope: "System safety engineering for defense systems",
    key_clauses: ["hazard analysis", "risk acceptance authority"],
    control_mappings: [{ framework: "rmf", control: "safety-cyber integration" }],
    regulation_mappings: [{ regulation_id: "DoDI_8510.01", section: "risk integration" }],
    implementation_guidance: "Integrate cybersecurity threat paths into safety hazard analysis.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "MIL", ref: "MIL-STD-882", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "DO_326A",
    name: "DO-326A / ED-202A",
    version: "current",
    publisher: "RTCA / EUROCAE",
    scope: "Airworthiness security process",
    key_clauses: ["security risk assessment", "security development lifecycle"],
    control_mappings: [{ framework: "iec_62443", control: "secure lifecycle equivalents" }],
    regulation_mappings: [{ regulation_id: "aviation_certification", section: "security assessment" }],
    implementation_guidance: "Use threat assessment and mitigation evidence in certification artifacts.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "RTCA", ref: "DO-326A", source_url: "https://www.rtca.org" }]
  },
  {
    id: "DO_356A",
    name: "DO-356A / ED-203A",
    version: "current",
    publisher: "RTCA / EUROCAE",
    scope: "Airworthiness security methods and considerations",
    key_clauses: ["security verification methods", "continued airworthiness security"],
    control_mappings: [{ framework: "iec_62443", control: "verification methods" }],
    regulation_mappings: [{ regulation_id: "aviation_certification", section: "security evidence" }],
    implementation_guidance: "Define repeatable verification evidence for airborne and ground systems.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "RTCA", ref: "DO-356A", source_url: "https://www.rtca.org" }]
  },
  {
    id: "DO_355",
    name: "DO-355 / ED-204",
    version: "current",
    publisher: "RTCA / EUROCAE",
    scope: "Information security guidance for continuing airworthiness",
    key_clauses: ["operations-phase security controls", "maintenance and update security", "continued airworthiness security monitoring"],
    control_mappings: [{ framework: "do_326a", control: "continued operational security" }],
    regulation_mappings: [{ regulation_id: "AIRWORTHINESS_CYBER", section: "continued operational assurance" }],
    implementation_guidance:
      "Extend cybersecurity controls into fleet operations, maintenance, and service bulletins with documented residual risk acceptance.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "RTCA", ref: "DO-355", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "DO_178C",
    name: "DO-178C / ED-12C",
    version: "current",
    publisher: "RTCA / EUROCAE",
    scope: "Software considerations in airborne systems and equipment certification",
    key_clauses: ["development assurance levels (DAL A-E)", "software lifecycle objectives", "verification independence"],
    control_mappings: [{ framework: "airworthiness", control: "software assurance evidence" }],
    regulation_mappings: [{ regulation_id: "AIRBORNE_SOFTWARE_ASSURANCE", section: "all lifecycle objectives" }],
    implementation_guidance:
      "Maintain end-to-end software requirements traceability and independent verification artifacts aligned to assigned DAL.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "RTCA", ref: "DO-178C", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "DO_254",
    name: "DO-254 / ED-80",
    version: "current",
    publisher: "RTCA / EUROCAE",
    scope: "Design assurance guidance for airborne electronic hardware",
    key_clauses: ["hardware planning and requirements", "elemental analysis", "verification and configuration control"],
    control_mappings: [{ framework: "airworthiness", control: "hardware assurance evidence" }],
    regulation_mappings: [{ regulation_id: "AIRBORNE_HARDWARE_ASSURANCE", section: "all lifecycle objectives" }],
    implementation_guidance:
      "Apply hardware planning, verification, and configuration control evidence for complex airborne electronic hardware.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "RTCA", ref: "DO-254", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "ARP4754A",
    name: "SAE ARP4754A",
    version: "current",
    publisher: "SAE International",
    scope: "Guidelines for development of civil aircraft and systems",
    key_clauses: ["integrated aircraft/system development", "requirements allocation and validation", "development planning"],
    control_mappings: [{ framework: "airworthiness", control: "system lifecycle integration" }],
    regulation_mappings: [{ regulation_id: "AIRCRAFT_SYSTEM_DEVELOPMENT", section: "all" }],
    implementation_guidance:
      "Use integrated aircraft and system development planning with traceable requirement allocation across airborne and ground components.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "SAE", ref: "ARP4754A", source_url: "https://www.sae.org/standards/content/arp4754a/" }]
  },
  {
    id: "ARP4761A",
    name: "SAE ARP4761A",
    version: "current",
    publisher: "SAE International",
    scope: "Safety assessment process for civil airborne systems and equipment",
    key_clauses: ["functional hazard assessment", "preliminary system safety assessment", "system safety assessment"],
    control_mappings: [{ framework: "airworthiness", control: "hazard and safety evidence" }],
    regulation_mappings: [{ regulation_id: "AIRCRAFT_SYSTEM_SAFETY", section: "all" }],
    implementation_guidance:
      "Maintain FHA/PSSA/SSA artifacts linked to cybersecurity threat models and design assurance evidence for certification audits.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "SAE", ref: "ARP4761A", source_url: "https://www.sae.org/standards/content/arp4761a/" }]
  },
  {
    id: "EASA_PART_IS",
    name: "EASA Part-IS (EU 2023/203 and 2022/1645)",
    version: "current",
    publisher: "EASA / European Commission",
    scope: "Aviation information security risk management and incident reporting obligations",
    key_clauses: ["organizational ISMS for aviation", "incident reporting obligations", "continuing airworthiness information security"],
    control_mappings: [{ framework: "airworthiness", control: "operational information security governance" }],
    regulation_mappings: [
      { regulation_id: "EASA_PART_IS_2023_203", section: "implementing regulation" },
      { regulation_id: "EASA_PART_IS_2022_1645", section: "delegated regulation" }
    ],
    implementation_guidance:
      "Implement a regulator-auditable aviation ISMS that covers design, production, operations, continuing airworthiness, and mandatory incident reporting.",
    licensing_restrictions: "EU public law text",
    citations: [
      {
        type: "EU",
        ref: "Implementing Regulation (EU) 2023/203",
        source_url: "https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2023203"
      }
    ]
  },
  {
    id: "ECSS_E_ST_40",
    name: "ECSS-E-ST-40C",
    version: "current",
    publisher: "ECSS",
    scope: "Space software engineering lifecycle requirements",
    key_clauses: ["software lifecycle processes", "requirements traceability", "verification planning"],
    control_mappings: [{ framework: "space-engineering", control: "mission software lifecycle governance" }],
    regulation_mappings: [{ regulation_id: "SPACE_MISSION_ASSURANCE", section: "software engineering baseline" }],
    implementation_guidance:
      "Apply ECSS-E-ST-40 lifecycle controls across mission segment and ground segment software with auditable verification evidence.",
    licensing_restrictions: "Public summary / licensed detail",
    citations: [{ type: "ECSS", ref: "ECSS-E-ST-40C", source_url: "https://ecss.nl" }]
  },
  {
    id: "ECSS_Q_ST_80",
    name: "ECSS-Q-ST-80C",
    version: "current",
    publisher: "ECSS",
    scope: "Space software product assurance requirements",
    key_clauses: ["software assurance planning", "quality objectives", "independence and verification"],
    control_mappings: [{ framework: "space-assurance", control: "software assurance baseline" }],
    regulation_mappings: [{ regulation_id: "SPACE_MISSION_ASSURANCE", section: "software assurance baseline" }],
    implementation_guidance:
      "Integrate software assurance objectives, defect governance, and independent verification evidence into mission acceptance criteria.",
    licensing_restrictions: "Public summary / licensed detail",
    citations: [{ type: "ECSS", ref: "ECSS-Q-ST-80C", source_url: "https://ecss.nl" }]
  },
  {
    id: "NASA_NPR_7150_2",
    name: "NASA NPR 7150.2",
    version: "current",
    publisher: "NASA",
    scope: "Software engineering requirements for NASA mission and support systems",
    key_clauses: ["software classification and rigor", "lifecycle requirements", "assurance and independent verification"],
    control_mappings: [{ framework: "space-assurance", control: "software rigor and assurance" }],
    regulation_mappings: [{ regulation_id: "NASA_MISSION_SOFTWARE", section: "software lifecycle baseline" }],
    implementation_guidance:
      "Use NPR 7150.2 software class and assurance expectations to set mission software rigor, testing, and independent verification requirements.",
    licensing_restrictions: "Public domain",
    citations: [
      {
        type: "NASA",
        ref: "NPR 7150.2",
        source_url: "https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7150&s=2"
      }
    ]
  },
  {
    id: "MIL_STD_1553",
    name: "MIL-STD-1553",
    version: "current",
    publisher: "US DoD",
    scope: "Digital command/response avionics data bus interoperability",
    key_clauses: ["bus controller and remote terminal interoperability", "deterministic message timing expectations"],
    control_mappings: [{ framework: "avionics-integration", control: "data bus interoperability baseline" }],
    regulation_mappings: [{ regulation_id: "AVIONICS_INTERFACE_BASELINE", section: "mission bus interoperability" }],
    implementation_guidance:
      "Use MIL-STD-1553 interface and message baseline controls for deterministic avionics integration and test verification.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "MIL", ref: "MIL-STD-1553", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "MIL_STD_1760",
    name: "MIL-STD-1760",
    version: "current",
    publisher: "US DoD",
    scope: "Aircraft/store electrical and data interface interoperability",
    key_clauses: ["store interface compatibility", "power/data interconnect requirements"],
    control_mappings: [{ framework: "avionics-integration", control: "aircraft payload interface interoperability" }],
    regulation_mappings: [{ regulation_id: "AVIONICS_INTERFACE_BASELINE", section: "aircraft-store interface baseline" }],
    implementation_guidance:
      "Apply MIL-STD-1760 interface controls to payload/store integration with explicit compatibility and certification evidence.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "MIL", ref: "MIL-STD-1760", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "DO_160",
    name: "DO-160",
    version: "current",
    publisher: "RTCA",
    scope: "Environmental conditions and test procedures for airborne equipment",
    key_clauses: ["environmental qualification test categories", "equipment resilience baseline"],
    control_mappings: [{ framework: "airworthiness", control: "environmental qualification evidence" }],
    regulation_mappings: [{ regulation_id: "AIRBORNE_EQUIPMENT_ENVIRONMENTAL_QUALIFICATION", section: "environmental qualification profile" }],
    implementation_guidance:
      "Integrate DO-160 qualification planning and evidence into airborne equipment release and sustainment workflows.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "RTCA", ref: "DO-160", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "FACE_TS",
    name: "FACE Technical Standard",
    version: "current",
    publisher: "The Open Group FACE Consortium",
    scope: "Open architecture conformance for airborne software portability and interoperability",
    key_clauses: ["conformance profiles", "portable software segment interfaces"],
    control_mappings: [{ framework: "open-architecture", control: "airborne software portability baseline" }],
    regulation_mappings: [{ regulation_id: "MOSA_OPEN_ARCHITECTURE", section: "face conformance profile" }],
    implementation_guidance:
      "Adopt FACE-aligned software segmentation and conformance evidence to improve cross-platform portability and coalition interoperability.",
    licensing_restrictions: "Public summary / licensed detail",
    citations: [{ type: "FACE", ref: "Technical Standard", source_url: "https://www.opengroup.org/face" }]
  },
  {
    id: "SOSA_TS",
    name: "SOSA Technical Standard",
    version: "current",
    publisher: "The Open Group SOSA Consortium",
    scope: "Open modular sensor architecture interoperability profiles",
    key_clauses: ["modular sensor architecture profile", "plug-and-play interoperability constraints"],
    control_mappings: [{ framework: "open-architecture", control: "modular sensor interoperability baseline" }],
    regulation_mappings: [{ regulation_id: "MOSA_OPEN_ARCHITECTURE", section: "sosa conformance profile" }],
    implementation_guidance:
      "Use SOSA profiles to enforce modular sensor integration boundaries and evidence-backed interoperability in mission systems.",
    licensing_restrictions: "Public summary / licensed detail",
    citations: [{ type: "SOSA", ref: "Technical Standard", source_url: "https://www.opengroup.org/sosa" }]
  },
  {
    id: "NATO_STANAG_4671",
    name: "NATO STANAG 4671",
    version: "Edition current",
    publisher: "NATO",
    scope: "Unmanned aerial systems airworthiness interoperability requirements",
    key_clauses: ["coalition UAS airworthiness criteria", "certification evidence interoperability"],
    control_mappings: [{ framework: "coalition-uav", control: "uas airworthiness interoperability baseline" }],
    regulation_mappings: [{ regulation_id: "NATO_C_M_2002_49", section: "coalition UAS certification alignment" }],
    implementation_guidance:
      "Align UAS airworthiness criteria and certification evidence packages to coalition interoperability expectations in joint operations.",
    licensing_restrictions: "Public summary only",
    citations: [{ type: "NATO", ref: "STANAG 4671", source_url: "https://nso.nato.int" }]
  },
  {
    id: "AS9100D_QMS",
    name: "AS9100D",
    version: "D revision",
    publisher: "IAQG / SAE International",
    scope: "Quality management system requirements for aviation, space, and defense organizations",
    key_clauses: ["risk-based thinking", "configuration management", "product safety and counterfeit prevention"],
    control_mappings: [{ framework: "quality-assurance", control: "aerospace qms baseline" }],
    regulation_mappings: [{ regulation_id: "AEROSPACE_QUALITY_MANAGEMENT", section: "organization-wide quality baseline" }],
    implementation_guidance:
      "Implement AS9100D-aligned quality governance, traceability, and nonconformance controls across design, production, and sustainment workflows.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "SAE", ref: "AS9100D", source_url: "https://www.sae.org/standards/content/as9100d/" }]
  },
  {
    id: "AS9110C_MRO_QMS",
    name: "AS9110C",
    version: "C revision",
    publisher: "IAQG / SAE International",
    scope: "Quality management system requirements for aerospace maintenance organizations",
    key_clauses: ["maintenance release integrity", "work package control", "airworthiness records quality"],
    control_mappings: [{ framework: "quality-assurance", control: "maintenance and sustainment qms baseline" }],
    regulation_mappings: [{ regulation_id: "AEROSPACE_QUALITY_MANAGEMENT", section: "maintenance organization baseline" }],
    implementation_guidance:
      "Adopt AS9110C maintenance quality controls to preserve airworthiness release integrity and auditable sustainment records.",
    licensing_restrictions: "Licensed standard text",
    citations: [{ type: "SAE", ref: "AS9110C", source_url: "https://www.sae.org/standards/content/as9110c/" }]
  },
  {
    id: "MIL_STD_810",
    name: "MIL-STD-810",
    version: "current",
    publisher: "US DoD",
    scope: "Environmental engineering considerations and laboratory testing",
    key_clauses: ["mission profile tailoring", "environmental stress test methods", "qualification evidence traceability"],
    control_mappings: [{ framework: "qualification", control: "environmental test qualification baseline" }],
    regulation_mappings: [{ regulation_id: "AIRBORNE_EQUIPMENT_ENVIRONMENTAL_QUALIFICATION", section: "mission profile qualification tailoring" }],
    implementation_guidance:
      "Tailor environmental test profiles to operational mission conditions and maintain objective qualification evidence for design acceptance.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "MIL", ref: "MIL-STD-810", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "MIL_STD_461",
    name: "MIL-STD-461",
    version: "current",
    publisher: "US DoD",
    scope: "Electromagnetic interference and compatibility control requirements",
    key_clauses: ["conducted and radiated emissions limits", "susceptibility limits", "EMI/EMC verification evidence"],
    control_mappings: [{ framework: "qualification", control: "electromagnetic compatibility assurance baseline" }],
    regulation_mappings: [{ regulation_id: "MISSION_EMC_ASSURANCE", section: "emission and susceptibility qualification" }],
    implementation_guidance:
      "Integrate MIL-STD-461 emissions and susceptibility verification into subsystem qualification and platform integration acceptance gates.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "MIL", ref: "MIL-STD-461", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "MIL_HDBK_516",
    name: "MIL-HDBK-516",
    version: "current",
    publisher: "US DoD",
    scope: "Military aircraft airworthiness certification criteria",
    key_clauses: ["airworthiness criteria baseline", "compliance evidence expectations", "certification authority decision support"],
    control_mappings: [{ framework: "airworthiness", control: "military certification criteria baseline" }],
    regulation_mappings: [{ regulation_id: "AIRWORTHINESS_CERTIFICATION_CRITERIA", section: "military airworthiness evidence baseline" }],
    implementation_guidance:
      "Use MIL-HDBK-516 criteria to structure military airworthiness compliance evidence across design, qualification, and sustainment decisions.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "MIL", ref: "MIL-HDBK-516", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "NIST_SP_800_37",
    name: "NIST SP 800-37 Rev.2",
    version: "Rev.2 (2018)",
    publisher: "NIST",
    scope: "Risk Management Framework lifecycle for mission systems",
    key_clauses: ["prepare", "categorize", "select", "implement", "assess", "authorize", "monitor"],
    control_mappings: [{ framework: "nist_sp_800_53", control: "RMF lifecycle integration" }],
    regulation_mappings: [{ regulation_id: "DODI_8510_01", section: "RMF execution model" }],
    implementation_guidance:
      "Use RMF lifecycle governance to align system authorization boundaries, control inheritance, and continuous monitoring evidence.",
    licensing_restrictions: "Public domain",
    citations: [{ type: "NIST", ref: "SP 800-37 Rev.2", source_url: "https://csrc.nist.gov/pubs/sp/800/37/r2/final" }]
  },
  {
    id: "NIST_SP_800_61",
    name: "NIST SP 800-61 Rev.3",
    version: "Rev.3 (2025)",
    publisher: "NIST",
    scope: "Computer security incident response recommendations",
    key_clauses: ["preparation", "detection and analysis", "containment eradication and recovery", "post-incident activities"],
    control_mappings: [{ framework: "nist_sp_800_53", control: "IR family operationalization" }],
    regulation_mappings: [
      { regulation_id: "DFARS_252.204-7012_INCIDENT", section: "timely reporting support" },
      { regulation_id: "NIS2_DIRECTIVE_2022_2555_INCIDENT", section: "incident response process alignment" }
    ],
    implementation_guidance:
      "Operationalize incident detection, escalation, reporting, and lessons-learned workflows with evidence that aligns to contractual notification deadlines.",
    licensing_restrictions: "Public domain",
    citations: [{ type: "NIST", ref: "SP 800-61 Rev.3", source_url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final" }]
  },
  {
    id: "NIST_SP_800_53_DOD_OVERLAY",
    name: "NIST SP 800-53 (DoD overlay)",
    version: "Rev 5 + DoD overlays",
    publisher: "NIST / DoD",
    scope: "Security controls with DoD-specific augmentation",
    key_clauses: ["control families", "overlay tailoring"],
    control_mappings: [{ framework: "rmf", control: "baseline selection" }],
    regulation_mappings: [{ regulation_id: "DoDI_8500.01", section: "control implementation" }],
    implementation_guidance: "Use RMF tailoring with overlay deltas and mission overlays.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "NIST", ref: "SP 800-53", source_url: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final" }]
  },
  {
    id: "ICD_503",
    name: "ICD 503",
    version: "current",
    publisher: "ODNI",
    scope: "IC information technology systems security risk management",
    key_clauses: ["authorization process", "continuous monitoring"],
    control_mappings: [{ framework: "cnssi_1253", control: "nss alignment" }],
    regulation_mappings: [{ regulation_id: "national_intelligence", section: "authorization requirements" }],
    implementation_guidance: "Map mission intelligence system boundaries and authority-to-operate needs.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "IC", ref: "ICD 503", source_url: "https://www.dni.gov" }]
  },
  {
    id: "JSIG",
    name: "Joint SAP Implementation Guide",
    version: "current",
    publisher: "US DoD / JSIG authorship",
    scope: "Special access program security implementation guidance",
    key_clauses: ["SAP-specific controls", "accreditation requirements"],
    control_mappings: [{ framework: "nist_sp_800_53", control: "SAP overlays" }],
    regulation_mappings: [{ regulation_id: "sap_security", section: "implementation profile" }],
    implementation_guidance: "Apply additional controls for SAP enclaves and transfer boundaries.",
    licensing_restrictions: "Controlled distribution for full text",
    citations: [{ type: "JSIG", ref: "JSIG", source_url: "https://public.cyber.mil" }]
  },
  {
    id: "DODI_8500_01",
    name: "DoDI 8500.01",
    version: "Current (DoD Issuances release date 2025-11-13)",
    publisher: "US DoD",
    scope: "DoD cybersecurity policy",
    key_clauses: ["cybersecurity responsibilities", "baseline policy"],
    control_mappings: [{ framework: "rmf", control: "policy baseline" }],
    regulation_mappings: [{ regulation_id: "DOD_POLICY", section: "all" }],
    implementation_guidance: "Establish governance and accountability for cyber risk management.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "DODI", ref: "8500.01", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  },
  {
    id: "DODI_8510_01",
    name: "DoDI 8510.01",
    version: "Current (DoD Issuances release date 2025-10-31)",
    publisher: "US DoD",
    scope: "Risk Management Framework for DoD IT",
    key_clauses: ["categorize-select-implement-assess-authorize-monitor"],
    control_mappings: [{ framework: "nist_sp_800_53", control: "RMF lifecycle" }],
    regulation_mappings: [{ regulation_id: "RMF", section: "all" }],
    implementation_guidance: "Define ATO pathway and ongoing continuous monitoring evidence.",
    licensing_restrictions: "Public guidance",
    citations: [{ type: "DODI", ref: "8510.01", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  }
];

const applicabilityRules = [
  {
    id: "rule-us-prime-cui",
    condition: { country: ["US", "US-*"], role: ["prime_contractor"], data_types: ["cui"] },
    obligation: {
      regulation_id: "CMMC_2_0",
      standard_id: "NIST_SP_800_171",
      confidence: "authoritative",
      basis: "CUI in DoD contract requires CMMC Level 2 controls and assessment pathway"
    },
    rationale: "Prime contractors handling CUI are in-scope for CMMC L2 and DFARS safeguarding/reporting.",
    citations: [{ type: "CFR", ref: "DFARS 252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" }]
  },
  {
    id: "rule-us-sub-cui",
    condition: { country: ["US", "US-*"], role: ["defense_subcontractor", "subcontractor"], data_types: ["cui"] },
    obligation: {
      regulation_id: "DFARS_252.204-7012",
      standard_id: "NIST_SP_800_171",
      confidence: "authoritative",
      basis: "Flowdown requirements apply to subcontractors handling CUI"
    },
    rationale: "Subcontractors are subject to flowed-down DFARS and CMMC obligations when touching CUI.",
    citations: [{ type: "CFR", ref: "DFARS 252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" }]
  },
  {
    id: "rule-us-cui-assessment-notice",
    condition: { country: ["US", "US-*"], role: ["prime_contractor", "defense_subcontractor", "subcontractor"], data_types: ["cui"] },
    obligation: {
      regulation_id: "DFARS_252.204-7019",
      standard_id: "DFARS_7019_ASSESSMENT",
      confidence: "authoritative",
      basis: "Offerors handling CUI must maintain current NIST SP 800-171 DoD assessment results in SPRS."
    },
    rationale: "DFARS 252.204-7019 creates a pre-award assessment visibility requirement for CUI contracts.",
    citations: [{ type: "DFARS", ref: "252.204-7019", source_url: "https://www.acquisition.gov/dfars/252.204-7019-notice-nist-sp-800-171-dod-assessment-requirements" }]
  },
  {
    id: "rule-us-cui-assessment-access",
    condition: { country: ["US", "US-*"], role: ["prime_contractor", "defense_subcontractor", "subcontractor"], data_types: ["cui"] },
    obligation: {
      regulation_id: "DFARS_252.204-7020",
      standard_id: "DFARS_7020_ASSESSMENT",
      confidence: "authoritative",
      basis: "Contractors handling CUI must support DoD medium/high cybersecurity assessments when requested."
    },
    rationale: "DFARS 252.204-7020 requires contractor support for DoD assessment execution and evidence access.",
    citations: [{ type: "DFARS", ref: "252.204-7020", source_url: "https://www.acquisition.gov/dfars/252.204-7020-nist-sp-800-171-dod-assessment-requirements" }]
  },
  {
    id: "rule-us-scrm",
    condition: {
      country: ["US", "US-*"],
      role: ["prime_contractor", "defense_subcontractor", "subcontractor", "aerospace_oem"],
      data_types: ["supply-chain-data", "program-protection", "weapons-system-data"]
    },
    obligation: {
      regulation_id: "NIST_SP_800_161",
      standard_id: "NIST_SP_800_161",
      confidence: "inferred",
      basis: "Defense programs should apply formal cybersecurity supply chain risk management practices and supplier controls."
    },
    rationale: "Complex defense supply chains require structured C-SCRM controls for provenance, supplier risk, and assurance.",
    citations: [{ type: "NIST", ref: "SP 800-161 Rev.1", source_url: "https://csrc.nist.gov/pubs/sp/800/161/r1/final" }]
  },
  {
    id: "rule-us-ssdf",
    condition: {
      country: ["US", "US-*"],
      role: ["prime_contractor", "defense_subcontractor", "subcontractor", "aerospace_oem"],
      data_types: ["weapons-system-data", "program-protection"]
    },
    obligation: {
      regulation_id: "NIST_SP_800_218",
      standard_id: "NIST_SP_800_218",
      confidence: "inferred",
      basis: "Programs delivering defense software should maintain secure software development lifecycle evidence aligned to SSDF."
    },
    rationale: "Defense software assurance depends on repeatable secure development practices and vulnerability response governance.",
    citations: [{ type: "NIST", ref: "SP 800-218", source_url: "https://csrc.nist.gov/pubs/sp/800/218/final" }]
  },
  {
    id: "rule-us-fci",
    condition: { country: ["US", "US-*"], data_types: ["fci"] },
    obligation: {
      regulation_id: "FAR_52.204-21",
      standard_id: "CMMC_2_0",
      confidence: "authoritative",
      basis: "FCI-only contracts map to foundational safeguarding"
    },
    rationale: "FCI contracts require FAR basic safeguarding and CMMC Level 1 baseline.",
    citations: [{ type: "FAR", ref: "52.204-21", source_url: "https://www.acquisition.gov/far/52.204-21" }]
  },
  {
    id: "rule-us-itar",
    condition: { country: ["US", "US-*"], data_types: ["itar-controlled"] },
    obligation: {
      regulation_id: "ITAR_22_CFR_120_130",
      standard_id: "TCP_PROGRAM",
      confidence: "authoritative",
      basis: "USML technical data requires export controls and technology control plan"
    },
    rationale: "ITAR applies to defense technical data and services, including deemed export contexts.",
    citations: [{ type: "CFR", ref: "22 CFR 120-130", source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M" }]
  },
  {
    id: "rule-us-ear",
    condition: { country: ["US", "US-*"], data_types: ["ear-controlled"] },
    obligation: {
      regulation_id: "EAR_15_CFR_730_774",
      standard_id: "EXPORT_CLASSIFICATION_PROGRAM",
      confidence: "authoritative",
      basis: "ECCN and license determination required"
    },
    rationale: "EAR obligations apply to dual-use technology and software transfers.",
    citations: [{ type: "CFR", ref: "15 CFR 730-774", source_url: "https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C" }]
  },
  {
    id: "rule-us-dod-program",
    condition: { country: ["US"], programs: ["DoD"] },
    obligation: {
      regulation_id: "NISPOM_32_CFR_117",
      standard_id: "NIST_SP_800_53_DOD_OVERLAY",
      confidence: "authoritative",
      basis: "Classified or cleared facility operations align to NISPOM and DoD policy"
    },
    rationale: "DoD programs with controlled or classified elements require NISPOM alignment.",
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  },
  {
    id: "rule-us-rmf-governance",
    condition: { country: ["US", "US-*"], role: ["prime_contractor", "defense_subcontractor", "aerospace_oem"], programs: ["DoD"] },
    obligation: {
      regulation_id: "NIST_SP_800_37",
      standard_id: "NIST_SP_800_37",
      confidence: "inferred",
      basis: "DoD mission systems should apply RMF lifecycle governance aligned to authorization and continuous monitoring."
    },
    rationale: "RMF lifecycle discipline is foundational for defensible authorization, inheritance, and monitoring decisions in defense programs.",
    citations: [{ type: "NIST", ref: "SP 800-37 Rev.2", source_url: "https://csrc.nist.gov/pubs/sp/800/37/r2/final" }]
  },
  {
    id: "rule-us-avionics-data-bus",
    condition: {
      country: ["US", "US-*"],
      role: ["aerospace_oem"],
      system_types: ["aircraft", "uav", "da-uav", "da-weapons-system"],
      data_types: ["weapons-system-data", "program-protection"]
    },
    obligation: {
      regulation_id: "MIL_STD_1553",
      standard_id: "MIL_STD_1553",
      confidence: "inferred",
      basis: "Airborne mission-system integration should use a deterministic avionics data bus interoperability baseline."
    },
    rationale: "MIL-STD-1553 remains a foundational interoperability baseline for many defense avionics integration contexts.",
    citations: [{ type: "MIL", ref: "MIL-STD-1553", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "rule-us-aircraft-store-interface",
    condition: {
      country: ["US", "US-*"],
      role: ["aerospace_oem"],
      system_types: ["aircraft", "uav", "da-uav", "da-weapons-system"],
      data_types: ["weapons-system-data"]
    },
    obligation: {
      regulation_id: "MIL_STD_1760",
      standard_id: "MIL_STD_1760",
      confidence: "inferred",
      basis: "Aircraft and payload/store integration should meet standardized electrical/data interface interoperability requirements."
    },
    rationale: "MIL-STD-1760 compatibility lowers integration risk for weapon and mission payload interfaces.",
    citations: [{ type: "MIL", ref: "MIL-STD-1760", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "rule-airborne-environmental-qualification",
    condition: {
      country: ["US", "EU", "UK", "SE", "NL", "DE", "FR", "IT", "ES"],
      role: ["aerospace_oem"],
      system_types: ["aircraft", "uav", "da-uav", "da-weapons-system"]
    },
    obligation: {
      regulation_id: "DO_160",
      standard_id: "DO_160",
      confidence: "inferred",
      basis: "Airborne equipment should maintain environmental qualification evidence aligned to aviation mission profiles."
    },
    rationale: "DO-160 qualification evidence is commonly required to demonstrate airborne equipment resilience across operational environments.",
    citations: [{ type: "RTCA", ref: "DO-160", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "rule-us-mil-environmental-engineering",
    condition: {
      country: ["US", "US-*"],
      role: ["aerospace_oem"],
      system_types: ["aircraft", "uav", "da-uav", "da-weapons-system"],
      data_types: ["weapons-system-data", "program-protection"]
    },
    obligation: {
      regulation_id: "MIL_STD_810",
      standard_id: "MIL_STD_810",
      confidence: "inferred",
      basis: "Defense airborne and mission systems should maintain mission-tailored environmental qualification evidence."
    },
    rationale: "MIL-STD-810 testing remains a common baseline for mission-profile environmental qualification in defense programs.",
    citations: [{ type: "MIL", ref: "MIL-STD-810", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "rule-us-mil-emc-hardening",
    condition: {
      country: ["US", "US-*"],
      role: ["aerospace_oem"],
      system_types: ["aircraft", "uav", "da-uav", "da-weapons-system", "da-tactical-network"],
      data_types: ["weapons-system-data", "program-protection", "nato-classified"]
    },
    obligation: {
      regulation_id: "MIL_STD_461",
      standard_id: "MIL_STD_461",
      confidence: "inferred",
      basis: "Mission subsystems should satisfy electromagnetic compatibility and interference control qualification criteria."
    },
    rationale: "MIL-STD-461 reduces mission risk from emissions and susceptibility issues across integrated defense platforms.",
    citations: [{ type: "MIL", ref: "MIL-STD-461", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "rule-us-airworthiness-certification-criteria",
    condition: {
      country: ["US", "US-*"],
      role: ["aerospace_oem"],
      system_types: ["aircraft", "uav", "da-uav"]
    },
    obligation: {
      regulation_id: "MIL_HDBK_516",
      standard_id: "MIL_HDBK_516",
      confidence: "inferred",
      basis: "Military aviation programs should maintain airworthiness certification evidence aligned to MIL-HDBK-516 criteria."
    },
    rationale: "MIL-HDBK-516 is widely used to structure military airworthiness certification criteria and evidence.",
    citations: [{ type: "MIL", ref: "MIL-HDBK-516", source_url: "https://quicksearch.dla.mil" }]
  },
  {
    id: "rule-aerospace-quality-management",
    condition: {
      country: ["US", "US-*", "EU", "UK", "SE", "NL", "DE", "FR", "IT", "ES", "NATO"],
      role: ["aerospace_oem", "prime_contractor", "defense_subcontractor"],
      system_types: ["aircraft", "uav", "da-uav", "da-weapons-system", "da-supply-chain"],
      data_types: ["weapons-system-data", "program-protection", "supply-chain-data"]
    },
    obligation: {
      regulation_id: "AS9100D_QMS",
      standard_id: "AS9100D_QMS",
      confidence: "inferred",
      basis: "Aerospace production programs should apply an aviation/space/defense quality management baseline."
    },
    rationale: "AS9100D provides common quality governance expectations across aerospace design and production supply chains.",
    citations: [{ type: "SAE", ref: "AS9100D", source_url: "https://www.sae.org/standards/content/as9100d/" }]
  },
  {
    id: "rule-aerospace-maintenance-quality-management",
    condition: {
      country: ["US", "US-*", "EU", "UK", "SE", "NL", "DE", "FR", "IT", "ES", "NATO"],
      role: ["aerospace_oem", "prime_contractor", "defense_subcontractor"],
      system_types: ["aircraft", "uav", "da-uav", "da-weapons-system"],
      data_types: ["weapons-system-data", "supply-chain-data"]
    },
    obligation: {
      regulation_id: "AS9110C_MRO_QMS",
      standard_id: "AS9110C_MRO_QMS",
      confidence: "inferred",
      basis: "Aviation sustainment and maintenance workflows should enforce aerospace maintenance quality management controls."
    },
    rationale: "AS9110C strengthens maintenance record integrity and quality discipline for aerospace sustainment activities.",
    citations: [{ type: "SAE", ref: "AS9110C", source_url: "https://www.sae.org/standards/content/as9110c/" }]
  },
  {
    id: "rule-nato-uas-airworthiness",
    condition: {
      country: ["NATO", "NATO-*", "SE", "NL", "DE", "FR", "IT", "ES", "UK", "NO", "US"],
      role: ["aerospace_oem", "prime_contractor", "defense_subcontractor"],
      system_types: ["uav", "da-uav"],
      data_types: ["weapons-system-data", "nato-classified"]
    },
    obligation: {
      regulation_id: "NATO_STANAG_4671",
      standard_id: "NATO_STANAG_4671",
      confidence: "inferred",
      basis: "Coalition UAS programs should align to NATO airworthiness interoperability criteria."
    },
    rationale: "STANAG 4671 supports coalition UAS airworthiness and interoperability alignment in multinational operations.",
    citations: [{ type: "NATO", ref: "STANAG 4671", source_url: "https://nso.nato.int" }]
  },
  {
    id: "rule-us-face-open-architecture",
    condition: {
      country: ["US", "US-*"],
      role: ["prime_contractor", "defense_subcontractor", "aerospace_oem"],
      system_types: ["da-uav", "da-weapons-system", "da-c2"],
      data_types: ["weapons-system-data", "program-protection"]
    },
    obligation: {
      regulation_id: "FACE_TS",
      standard_id: "FACE_TS",
      confidence: "inferred",
      basis: "DoD airborne software modernization programs should align open architecture components with FACE conformance profiles."
    },
    rationale: "FACE supports software portability and interoperability goals in mission-system modernization efforts.",
    citations: [{ type: "FACE", ref: "Technical Standard", source_url: "https://www.opengroup.org/face" }]
  },
  {
    id: "rule-us-sosa-open-architecture",
    condition: {
      country: ["US", "US-*", "NATO"],
      role: ["prime_contractor", "defense_subcontractor", "aerospace_oem"],
      system_types: ["da-c2", "da-isr", "da-tactical-network"],
      data_types: ["weapons-system-data", "nato-classified"]
    },
    obligation: {
      regulation_id: "SOSA_TS",
      standard_id: "SOSA_TS",
      confidence: "inferred",
      basis: "Mission-system sensor and processing architectures should align to SOSA modular interoperability profiles."
    },
    rationale: "SOSA alignment supports modular sensor/system integration and faster coalition capability insertion.",
    citations: [{ type: "SOSA", ref: "Technical Standard", source_url: "https://www.opengroup.org/sosa" }]
  },
  {
    id: "rule-us-aerospace-airworthiness",
    condition: { country: ["US", "EU", "SE", "NL", "DE"], role: ["aerospace_oem"], system_types: ["aircraft", "uav"] },
    obligation: {
      regulation_id: "AIRWORTHINESS_CYBER",
      standard_id: "DO_326A",
      confidence: "inferred",
      basis: "Airborne systems should include airworthiness cybersecurity lifecycle evidence"
    },
    rationale: "Cybersecurity assurance for aircraft/UAV software aligns with DO-326A/DO-356A methods.",
    citations: [{ type: "RTCA", ref: "DO-326A", source_url: "https://www.rtca.org" }]
  },
  {
    id: "rule-us-aerospace-continuing-airworthiness",
    condition: { country: ["US", "EU", "UK", "SE", "NL", "DE"], role: ["aerospace_oem"], system_types: ["aircraft", "uav"] },
    obligation: {
      regulation_id: "DO_355",
      standard_id: "DO_355",
      confidence: "inferred",
      basis: "Aircraft operators and OEMs should sustain cybersecurity controls during maintenance and operational life."
    },
    rationale: "Continuing airworthiness requires explicit cybersecurity maintenance and operational assurance practices.",
    citations: [{ type: "RTCA", ref: "DO-355", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "rule-us-aerospace-software-assurance",
    condition: { country: ["US", "EU", "UK", "SE", "NL", "DE"], role: ["aerospace_oem"], system_types: ["aircraft", "uav"] },
    obligation: {
      regulation_id: "DO_178C",
      standard_id: "DO_178C",
      confidence: "inferred",
      basis: "Airborne software should meet DAL-appropriate lifecycle and verification objectives for certification."
    },
    rationale: "Airborne software certification depends on DO-178C lifecycle evidence and verification rigor.",
    citations: [{ type: "RTCA", ref: "DO-178C", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "rule-us-aerospace-hardware-assurance",
    condition: { country: ["US", "EU", "UK", "SE", "NL", "DE"], role: ["aerospace_oem"], system_types: ["aircraft", "uav"] },
    obligation: {
      regulation_id: "DO_254",
      standard_id: "DO_254",
      confidence: "inferred",
      basis: "Airborne electronic hardware should satisfy design assurance lifecycle objectives and verification evidence."
    },
    rationale: "Airborne hardware assurance relies on structured planning, traceability, and verification per DO-254.",
    citations: [{ type: "RTCA", ref: "DO-254", source_url: "https://www.rtca.org/standards/" }]
  },
  {
    id: "rule-us-aerospace-system-development",
    condition: { country: ["US", "EU", "UK", "SE", "NL", "DE"], role: ["aerospace_oem"], system_types: ["aircraft", "uav"] },
    obligation: {
      regulation_id: "ARP4754A",
      standard_id: "ARP4754A",
      confidence: "inferred",
      basis: "Aircraft/system development should maintain integrated lifecycle planning and requirements allocation controls."
    },
    rationale: "ARP4754A supports consistent aircraft and system development governance across multidisciplinary teams.",
    citations: [{ type: "SAE", ref: "ARP4754A", source_url: "https://www.sae.org/standards/content/arp4754a/" }]
  },
  {
    id: "rule-us-aerospace-system-safety",
    condition: { country: ["US", "EU", "UK", "SE", "NL", "DE"], role: ["aerospace_oem"], system_types: ["aircraft", "uav"] },
    obligation: {
      regulation_id: "ARP4761A",
      standard_id: "ARP4761A",
      confidence: "inferred",
      basis: "Aircraft/system hazard analysis should be maintained with FHA/PSSA/SSA artifacts linked to cybersecurity threat models."
    },
    rationale: "ARP4761A supports safety case consistency and risk acceptance evidence for complex airborne systems.",
    citations: [{ type: "SAE", ref: "ARP4761A", source_url: "https://www.sae.org/standards/content/arp4761a/" }]
  },
  {
    id: "rule-eu-space-software-engineering",
    condition: {
      country: ["EU", "SE", "NL", "DE", "FR", "IT", "ES"],
      role: ["aerospace_oem"],
      system_types: ["satellite", "da-satellite"]
    },
    obligation: {
      regulation_id: "ECSS_E_ST_40",
      standard_id: "ECSS_E_ST_40",
      confidence: "inferred",
      basis: "European space missions should apply ECSS software engineering lifecycle requirements to mission and ground software."
    },
    rationale: "ECSS-E-ST-40 provides the baseline software engineering controls used in many European space programs.",
    citations: [{ type: "ECSS", ref: "ECSS-E-ST-40C", source_url: "https://ecss.nl" }]
  },
  {
    id: "rule-eu-space-software-assurance",
    condition: {
      country: ["EU", "SE", "NL", "DE", "FR", "IT", "ES"],
      role: ["aerospace_oem"],
      system_types: ["satellite", "da-satellite"]
    },
    obligation: {
      regulation_id: "ECSS_Q_ST_80",
      standard_id: "ECSS_Q_ST_80",
      confidence: "inferred",
      basis: "European space programs should maintain software product assurance evidence aligned to ECSS quality objectives."
    },
    rationale: "ECSS-Q-ST-80 drives software assurance discipline for space mission acceptance and risk reduction.",
    citations: [{ type: "ECSS", ref: "ECSS-Q-ST-80C", source_url: "https://ecss.nl" }]
  },
  {
    id: "rule-us-space-software-governance",
    condition: {
      country: ["US", "US-*"],
      role: ["aerospace_oem"],
      system_types: ["satellite", "da-satellite"]
    },
    obligation: {
      regulation_id: "NASA_NPR_7150_2",
      standard_id: "NASA_NPR_7150_2",
      confidence: "inferred",
      basis: "US mission software programs should align software lifecycle rigor and assurance to NASA NPR 7150.2."
    },
    rationale: "NPR 7150.2 is a common mission software engineering baseline in US space programs.",
    citations: [{ type: "NASA", ref: "NPR 7150.2", source_url: "https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7150&s=2" }]
  },
  {
    id: "rule-eu-aerospace-part-is",
    condition: { country: ["EU", "SE", "NL", "DE", "FR", "ES", "IT"], role: ["aerospace_oem"], system_types: ["aircraft", "uav"] },
    obligation: {
      regulation_id: "EASA_PART_IS_2023_203",
      standard_id: "EASA_PART_IS",
      confidence: "authoritative",
      basis: "EU aviation entities should implement Part-IS information security risk management and incident reporting controls.",
      legal_force: "regulation",
      conflict_group: "airworthiness-cybersecurity",
      precedence_tier: 2,
      clause_refs: ["clause-easa-part-is-2023-203", "clause-easa-part-is-2022-1645"]
    },
    rationale: "EASA Part-IS imposes aviation-sector information security governance across operational and continuing airworthiness domains.",
    citations: [
      {
        type: "EU",
        ref: "Implementing Regulation (EU) 2023/203",
        source_url: "https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2023203"
      }
    ]
  },
  {
    id: "rule-se-defense-sub",
    condition: { country: ["SE"], role: ["defense_subcontractor"], data_types: ["cui", "nato-classified"] },
    obligation: {
      regulation_id: "SE_DEFENSE_SECURITY_PROCUREMENT",
      standard_id: "NATO_STANAG_4774",
      confidence: "inferred",
      basis: "Swedish defense subcontractors in NATO contexts require national and NATO handling controls"
    },
    rationale: "Swedish protective security and NATO-aligned obligations apply for controlled defense sharing.",
    citations: [{ type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }]
  },
  {
    id: "rule-se-nato-restricted",
    condition: { country: ["SE"], data_types: ["nato-classified"] },
    obligation: {
      regulation_id: "NATO_FSC_HANDLING",
      standard_id: "NATO_STANAG_4778",
      confidence: "inferred",
      basis: "NATO restricted/confidential sharing requires metadata and caveat handling"
    },
    rationale: "Security clearance and handling procedures apply for NATO classified exchanges.",
    citations: [{ type: "NATO", ref: "STANAG 4778", source_url: "https://nso.nato.int" }]
  },
  {
    id: "rule-nato-classified-baseline",
    condition: { country: ["NATO"], data_types: ["nato-classified"] },
    obligation: {
      regulation_id: "NATO_FSC_HANDLING",
      standard_id: "NATO_STANAG_4774",
      confidence: "inferred",
      basis: "NATO member handling of classified alliance information requires NATO baseline labeling, caveat, and dissemination controls"
    },
    rationale:
      "NATO classified sharing requires alliance security policy implementation and national authority enforcement across participating member states.",
    citations: [{ type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }]
  },
  {
    id: "rule-eu-dual-use",
    condition: { country: ["EU", "SE", "NL", "DE"], data_types: ["ear-controlled", "itar-controlled"], export: ["EU"] },
    obligation: {
      regulation_id: "EU_DUAL_USE",
      standard_id: "EXPORT_CLASSIFICATION_PROGRAM",
      confidence: "inferred",
      basis: "EU import/re-export and dual-use controls may apply alongside US origin restrictions"
    },
    rationale: "US-controlled exports to EU require both US and recipient-state dual-use compliance checks.",
    citations: [{ type: "EU", ref: "Dual-Use Regulation (EU) 2021/821", source_url: "https://eur-lex.europa.eu/eli/reg/2021/821/oj" }]
  },
  {
    id: "rule-eu-defense-cyber-baseline",
    condition: {
      country: ["EU"],
      role: ["defense_subcontractor", "prime_contractor", "aerospace_oem"],
      data_types: ["supply-chain-data", "program-protection", "weapons-system-data", "cui"]
    },
    obligation: {
      regulation_id: "NIS2_DIRECTIVE_2022_2555",
      standard_id: "NIS2_ART_21_BASELINE",
      confidence: "inferred",
      basis: "EU defense-related entities should apply risk management and incident-handling controls aligned to NIS2 national implementations."
    },
    rationale: "NIS2 establishes minimum cybersecurity measures and incident obligations across EU member states via national transposition.",
    citations: [{ type: "EU", ref: "Directive (EU) 2022/2555", source_url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj" }]
  },
  {
    id: "rule-eu-export-screening",
    condition: { country: ["EU"], data_types: ["ear-controlled", "itar-controlled"] },
    obligation: {
      regulation_id: "EU_DUAL_USE",
      standard_id: "END_USE_END_USER_SCREENING",
      confidence: "inferred",
      basis: "EU entities receiving controlled technologies require dual-use classification and end-user screening controls."
    },
    rationale: "EU dual-use implementation and member-state authority review are required even where technology is US-origin.",
    citations: [{ type: "EU", ref: "Regulation (EU) 2021/821", source_url: "https://eur-lex.europa.eu/eli/reg/2021/821/oj" }]
  },
  {
    id: "rule-nato-sharing",
    condition: { country: ["SE", "NL", "DE", "US", "UK"], data_types: ["nato-classified"], additional_context: ["coalition_sharing"] },
    obligation: {
      regulation_id: "NATO_C_M_2002_49",
      standard_id: "NATO_STANAG_4774",
      confidence: "authoritative",
      basis: "Coalition sharing of NATO classified information requires NATO security policy implementation"
    },
    rationale: "Coalition operations require caveat and label-compliant information exchange.",
    citations: [{ type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }]
  },
  {
    id: "rule-nato-uav-interoperability",
    condition: {
      country: ["NATO", "SE", "NL", "DE", "US", "UK", "FR", "IT"],
      role: ["aerospace_oem", "prime_contractor", "defense_subcontractor"],
      system_types: ["uav", "da-uav"],
      data_types: ["nato-classified", "weapons-system-data"],
      additional_context: ["coalition_sharing"]
    },
    obligation: {
      regulation_id: "NATO_STANAG_4586",
      standard_id: "NATO_STANAG_4586",
      confidence: "inferred",
      basis: "Coalition UAV operations should align control-system interoperability to STANAG 4586 interface profiles."
    },
    rationale: "STANAG 4586 interoperability reduces coalition UAV command/control integration failures.",
    citations: [{ type: "NATO", ref: "STANAG 4586", source_url: "https://nso.nato.int" }]
  },
  {
    id: "rule-nato-isr-imagery-interoperability",
    condition: {
      country: ["NATO", "SE", "NL", "DE", "US", "UK", "FR", "IT"],
      role: ["aerospace_oem", "prime_contractor", "defense_subcontractor"],
      system_types: ["uav", "satellite", "da-uav", "da-satellite", "da-isr"],
      data_types: ["nato-classified", "weapons-system-data"],
      additional_context: ["coalition_sharing"]
    },
    obligation: {
      regulation_id: "NATO_STANAG_4609",
      standard_id: "NATO_STANAG_4609",
      confidence: "inferred",
      basis: "Coalition ISR imagery workflows should use STANAG 4609-compatible formats and metadata."
    },
    rationale: "STANAG 4609 enables interoperable ISR motion imagery exploitation across coalition systems.",
    citations: [{ type: "NATO", ref: "STANAG 4609", source_url: "https://nso.nato.int" }]
  },
  {
    id: "rule-nato-tactical-data-link",
    condition: {
      country: ["NATO", "SE", "NL", "DE", "US", "UK", "FR", "IT"],
      system_types: ["da-tactical-network", "da-c2", "uav"],
      data_types: ["nato-classified", "weapons-system-data"],
      additional_context: ["coalition_sharing"]
    },
    obligation: {
      regulation_id: "NATO_STANAG_5516",
      standard_id: "NATO_STANAG_5516",
      confidence: "inferred",
      basis: "Coalition tactical data exchanges should align to STANAG 5516 interoperability profiles."
    },
    rationale: "STANAG 5516 governs tactical data link interoperability that underpins coalition C2 and air operations.",
    citations: [{ type: "NATO", ref: "STANAG 5516", source_url: "https://nso.nato.int" }]
  },
  {
    id: "rule-program-protection",
    condition: { country: ["US", "SE", "NL", "DE", "UK"], data_types: ["program-protection", "weapons-system-data"] },
    obligation: {
      regulation_id: "DODI_5200_39",
      standard_id: "MIL_STD_882",
      confidence: "inferred",
      basis: "Critical program information and mission safety engineering obligations should be applied"
    },
    rationale: "CPI requires structured protection strategy and cyber-safety integration.",
    citations: [{ type: "DODI", ref: "5200.39", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  },
  {
    id: "rule-classified-us",
    condition: { country: ["US"], data_types: ["national-classified", "nato-classified", "eu-classified"] },
    obligation: {
      regulation_id: "NISPOM_32_CFR_117",
      standard_id: "CNSSI_1253",
      confidence: "authoritative",
      basis: "Classified handling in US context requires NISPOM and NSS control overlays"
    },
    rationale: "Classified systems require accredited environments and personnel controls.",
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  },
  {
    id: "rule-classified-eu",
    condition: { country: ["SE", "NL", "DE", "EU"], data_types: ["eu-classified", "national-classified"] },
    obligation: {
      regulation_id: "EUCI_HANDLING",
      standard_id: "NATO_STANAG_4774",
      confidence: "inferred",
      basis: "EU and national classified handling with coalition exchange needs labeling and caveat policy"
    },
    rationale: "Classified handling requirements differ nationally but require formal security controls.",
    citations: [{ type: "EU", ref: "2013/488/EU", source_url: "https://eur-lex.europa.eu/eli/dec/2013/488/oj" }]
  },
  {
    id: "rule-incident-reporting",
    condition: { country: ["US"], data_types: ["cui", "itar-controlled", "ear-controlled"] },
    obligation: {
      regulation_id: "DFARS_252.204-7012_INCIDENT",
      standard_id: "NIST_SP_800_171",
      confidence: "authoritative",
      basis: "Cyber incidents affecting covered defense information require 72-hour reporting"
    },
    rationale: "Reporting timelines and evidence preservation obligations are mandatory for affected covered defense information.",
    citations: [{ type: "CFR", ref: "DFARS 252.204-7012(d)", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" }]
  },
  {
    id: "rule-incident-response-process",
    condition: { country: ["US", "US-*"], data_types: ["cui", "fci", "itar-controlled", "ear-controlled"] },
    obligation: {
      regulation_id: "NIST_SP_800_61",
      standard_id: "NIST_SP_800_61",
      confidence: "inferred",
      basis: "Defense-relevant cyber incidents should follow a documented incident response lifecycle that supports contractual reporting timelines."
    },
    rationale: "Standardized incident response processes reduce reporting failures and improve forensic/evidence quality for defense contracts.",
    citations: [{ type: "NIST", ref: "SP 800-61 Rev.3", source_url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final" }]
  },
  {
    id: "rule-uk-mod-cyber-baseline",
    condition: {
      country: ["UK"],
      role: ["prime_contractor", "defense_subcontractor", "aerospace_oem"],
      data_types: ["cui", "supply-chain-data", "program-protection", "weapons-system-data"]
    },
    obligation: {
      regulation_id: "UK_DEFSTAN_05_138",
      standard_id: "UK_CYBER_ESSENTIALS_PLUS",
      confidence: "inferred",
      basis: "UK MoD contracts require Def Stan 05-138 compliance and Cyber Essentials Plus certification for suppliers handling defence information.",
      legal_force: "standard-policy",
      conflict_group: "cui-fci-compliance",
      precedence_tier: 3,
      clause_refs: ["clause-uk-defstan-05-138"]
    },
    rationale: "UK defence suppliers must meet Def Stan 05-138 cyber security requirements and hold valid Cyber Essentials Plus certification.",
    citations: [{ type: "UK", ref: "Def Stan 05-138", source_url: "https://www.dstan.mod.uk" }]
  },
  {
    id: "rule-uk-classified",
    condition: {
      country: ["UK"],
      data_types: ["national-classified", "nato-classified"]
    },
    obligation: {
      regulation_id: "UK_OSA_2023",
      standard_id: "UK_SECURITY_VETTING",
      confidence: "inferred",
      basis: "UK classified information handling governed by Official Secrets Act 2023 and national security vetting framework.",
      legal_force: "regulation",
      conflict_group: "classified-handling",
      precedence_tier: 2,
      clause_refs: []
    },
    rationale: "Handling UK classified information requires security clearance, facility accreditation, and compliance with Official Secrets Act 2023.",
    citations: [{ type: "UK", ref: "Official Secrets Act 2023", source_url: "https://www.legislation.gov.uk/ukpga/2023/32/contents" }]
  },
  {
    id: "rule-eu-cra-digital-products",
    condition: {
      country: ["EU"],
      role: ["defense_subcontractor", "prime_contractor", "aerospace_oem"],
      data_types: ["supply-chain-data", "weapons-system-data"]
    },
    obligation: {
      regulation_id: "EU_CRA_2024_2847",
      standard_id: "CRA_ESSENTIAL_REQUIREMENTS",
      confidence: "inferred",
      basis: "Products with digital elements placed on the EU market must meet CRA essential cybersecurity requirements for design, development, and vulnerability handling.",
      legal_force: "regulation",
      conflict_group: "general",
      precedence_tier: 4,
      clause_refs: ["clause-eu-cra-art6"]
    },
    rationale: "EU Cyber Resilience Act imposes horizontal cybersecurity requirements on hardware and software products, relevant to defense supply chain components.",
    citations: [{ type: "EU", ref: "Regulation (EU) 2024/2847", source_url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj" }]
  }
];

const OBLIGATION_CLAUSE_REFERENCE_MAP = {
  "CMMC_2_0": ["clause-cmmc-32cfr170-general", "clause-dfars-20475-general"],
  "DFARS_252.204-7012": ["clause-dfars-7012-b", "clause-dfars-7012-d"],
  "DFARS_252.204-7012_INCIDENT": ["clause-dfars-7012-d"],
  "FAR_52.204-21": ["clause-far-52-204-21"],
  "ITAR_22_CFR_120_130": ["clause-itar-22cfr120-130"],
  "EAR_15_CFR_730_774": ["clause-ear-15cfr730-774"],
  "EU_DUAL_USE": ["clause-eu-dual-use-art3"],
  "NIS2_DIRECTIVE_2022_2555": ["clause-nis2-art21"],
  "NATO_C_M_2002_49": ["clause-nato-cm2002-49"],
  "EUCI_HANDLING": ["clause-euci-2013-488"],
  "NATO_FSC_HANDLING": ["clause-nato-cm2002-49"],
  "DFARS_252.204-7021": ["clause-dfars-7021"],
  "DFARS_252.204-7025": ["clause-dfars-7025"],
  "DFARS_252.204-7019": ["clause-dfars-7019"],
  "DFARS_252.204-7020": ["clause-dfars-7020"],
  "NIST_SP_800_161": ["clause-nist-800-161r1"],
  "NIST_SP_800_218": ["clause-nist-800-218"],
  "NIST_SP_800_37": ["clause-nist-800-37r2"],
  "NIST_SP_800_61": ["clause-nist-800-61r3"],
  "MIL_STD_1553": ["clause-mil-std-1553"],
  "MIL_STD_1760": ["clause-mil-std-1760"],
  "DO_160": ["clause-do-160"],
  "FACE_TS": ["clause-face-ts"],
  "SOSA_TS": ["clause-sosa-ts"],
  "NATO_STANAG_4671": ["clause-stanag-4671"],
  "AS9100D_QMS": ["clause-as9100d"],
  "AS9110C_MRO_QMS": ["clause-as9110c"],
  "MIL_STD_810": ["clause-mil-std-810"],
  "MIL_STD_461": ["clause-mil-std-461"],
  "MIL_HDBK_516": ["clause-mil-hdbk-516"],
  "NATO_STANAG_4586": ["clause-stanag-4586"],
  "NATO_STANAG_4609": ["clause-stanag-4609"],
  "NATO_STANAG_5516": ["clause-stanag-5516"],
  "ECSS_E_ST_40": ["clause-ecss-e-st-40c"],
  "ECSS_Q_ST_80": ["clause-ecss-q-st-80c"],
  "NASA_NPR_7150_2": ["clause-nasa-npr-7150-2"],
  "DO_355": ["clause-do-355"],
  "DO_178C": ["clause-do-178c"],
  "DO_254": ["clause-do-254"],
  "ARP4754A": ["clause-arp4754a"],
  "ARP4761A": ["clause-arp4761a"],
  "EASA_PART_IS_2023_203": ["clause-easa-part-is-2023-203"],
  "EASA_PART_IS_2022_1645": ["clause-easa-part-is-2022-1645"],
  "EU_CRA_2024_2847": ["clause-eu-cra-art6"],
  "UK_DEFSTAN_05_138": ["clause-uk-defstan-05-138"]
};

function inferLegalForce(regulationId) {
  const id = String(regulationId || "").toLowerCase();
  if (id.includes("easa_part_is")) {
    return "regulation";
  }
  if (id.includes("cfr") || id.includes("dfars") || id.includes("far") || id.includes("itar") || id.includes("ear")) {
    return "regulation";
  }
  if (id.includes("directive")) {
    return "directive";
  }
  if (id.includes("decision")) {
    return "decision";
  }
  if (id.includes("stanag") || id.includes("nato")) {
    return "alliance-policy";
  }
  if (
    id.includes("nist") ||
    id.includes("dodi") ||
    id.includes("cmmc") ||
    id.includes("ecss") ||
    id.includes("npr") ||
    id.includes("do_") ||
    id.includes("arp") ||
    id.includes("mil_std") ||
    id.includes("mil_hdbk") ||
    id.includes("as9100") ||
    id.includes("as9110") ||
    id.includes("face_ts") ||
    id.includes("sosa_ts")
  ) {
    return "standard-policy";
  }
  return "guidance";
}

function inferConflictGroup(regulationId) {
  const id = String(regulationId || "").toLowerCase();
  if (id.includes("itar") || id.includes("ear") || id.includes("dual_use")) {
    return "export-control";
  }
  if (id.includes("nato") || id.includes("euci") || id.includes("nispom")) {
    return "classified-handling";
  }
  if (id.includes("incident") || id.includes("7012") || id.includes("nis2") || id.includes("800_61")) {
    return "incident-reporting";
  }
  if (
    id.includes("easa") ||
    id.includes("do_") ||
    id.includes("arp") ||
    id.includes("ecss") ||
    id.includes("npr") ||
    id.includes("mil_hdbk")
  ) {
    return "airworthiness-cybersecurity";
  }
  if (id.includes("face") || id.includes("sosa") || id.includes("mil_std") || id.includes("as9100") || id.includes("as9110")) {
    return "mission-assurance";
  }
  if (id.includes("cmmc") || id.includes("800_171") || id.includes("fci")) {
    return "cui-fci-compliance";
  }
  return "general";
}

function inferPrecedenceTier(legalForce) {
  if (legalForce === "regulation") {
    return 1;
  }
  if (legalForce === "directive" || legalForce === "decision") {
    return 2;
  }
  if (legalForce === "alliance-policy") {
    return 3;
  }
  if (legalForce === "standard-policy") {
    return 4;
  }
  return 5;
}

function enrichApplicabilityRuleMetadata(rules) {
  for (const rule of rules) {
    if (!rule.condition || !rule.obligation) {
      continue;
    }

    const countries = dedupeArray(rule.condition.country || []);
    if (countries.includes("EU") && !countries.includes("EU-*")) {
      countries.push("EU-*");
    }
    if (countries.includes("US") && !countries.includes("US-*")) {
      countries.push("US-*");
    }
    if (countries.includes("NATO") && !countries.includes("NATO-*")) {
      countries.push("NATO-*");
    }
    rule.condition.country = countries;

    const obligation = rule.obligation;
    obligation.legal_force = obligation.legal_force || inferLegalForce(obligation.regulation_id);
    obligation.conflict_group = obligation.conflict_group || inferConflictGroup(obligation.regulation_id);
    obligation.precedence_tier = obligation.precedence_tier || inferPrecedenceTier(obligation.legal_force);
    obligation.clause_refs = obligation.clause_refs || OBLIGATION_CLAUSE_REFERENCE_MAP[obligation.regulation_id] || [];
  }
}

enrichApplicabilityRuleMetadata(applicabilityRules);

const evidenceArtifacts = [
  {
    id: "ev-cmmc-ssp",
    audit_type: "CMMC Level 2",
    artifact_name: "System Security Plan (SSP)",
    description: "Defines CUI boundary, system components, and control implementation status for 110 practices.",
    mandatory: true,
    retention_period: "Contract term + 3 years",
    template_ref: "templates/cmmc/ssp.md",
    regulation_basis: [{ regulation_id: "CMMC_2_0", section: "Level 2" }],
    citations: [{ type: "DOD", ref: "CMMC 2.0", source_url: "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program" }]
  },
  {
    id: "ev-cmmc-poam",
    audit_type: "CMMC Level 2",
    artifact_name: "Plan of Action and Milestones (POA&M)",
    description: "Time-bound remediation plan for allowable deficiencies and evidence of closure.",
    mandatory: true,
    retention_period: "Until closure + 1 assessment cycle",
    template_ref: "templates/cmmc/poam.md",
    regulation_basis: [{ regulation_id: "CMMC_2_0", section: "POA&M policy" }],
    citations: [{ type: "DOD", ref: "CMMC 2.0", source_url: "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program" }]
  },
  {
    id: "ev-dfars-ir",
    audit_type: "DFARS 252.204-7012",
    artifact_name: "Incident reporting and preservation package",
    description: "Contains 72-hour report, forensic evidence preservation log, and damage assessment support records.",
    mandatory: true,
    retention_period: "Minimum 90 days evidence preservation",
    template_ref: "templates/dfars/incident-report.md",
    regulation_basis: [{ regulation_id: "DFARS_252.204-7012", section: "(d)-(e)" }],
    citations: [{ type: "CFR", ref: "DFARS 252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" }]
  },
  {
    id: "ev-export-tcp",
    audit_type: "ITAR/EAR Compliance",
    artifact_name: "Technology Control Plan (TCP)",
    description: "Defines physical, technical, and procedural controls to prevent unauthorized export of controlled technology.",
    mandatory: true,
    retention_period: "5 years after export event",
    template_ref: "templates/export/tcp.md",
    regulation_basis: [{ regulation_id: "ITAR_22_CFR_120_130", section: "control of technical data" }],
    citations: [{ type: "CFR", ref: "22 CFR 120-130", source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M" }]
  },
  {
    id: "ev-nispom-fsp",
    audit_type: "NISPOM / 32 CFR Part 117",
    artifact_name: "Facility Security Plan",
    description: "Facility-level security governance, classified handling process, and self-inspection evidence.",
    mandatory: true,
    retention_period: "Current revision + historical audit cycle",
    template_ref: "templates/nispom/fsp.md",
    regulation_basis: [{ regulation_id: "NISPOM_32_CFR_117", section: "facility responsibilities" }],
    citations: [{ type: "CFR", ref: "32 CFR 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }]
  },
  {
    id: "ev-rmf-package",
    audit_type: "RMF Authorization",
    artifact_name: "RMF authorization package",
    description: "System categorization, selected controls, assessment evidence, and authorization decision records.",
    mandatory: true,
    retention_period: "Authorization lifecycle",
    template_ref: "templates/rmf/authorization-package.md",
    regulation_basis: [{ regulation_id: "DoDI_8510.01", section: "RMF steps" }],
    citations: [{ type: "DODI", ref: "8510.01", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }]
  }
];

const jurisdictionComparisons = {
  "cmmc 2.0 vs swedish defense procurement": [
    {
      jurisdiction: "US",
      framework: "CMMC 2.0",
      obligations: [
        "Contractual level assignment (L1-L3)",
        "NIST 800-171 baseline at Level 2",
        "C3PAO or self-assessment based on contract",
        "POA&M limitations"
      ],
      timeline: "Driven by contract award and renewal",
      notes: "Highly control-prescriptive and defense-contract specific"
    },
    {
      jurisdiction: "SE",
      framework: "Swedish defense procurement security + protective security obligations",
      obligations: [
        "Protective security analysis",
        "Security-protected procurement clauses",
        "National security authority engagement",
        "NATO handling controls where applicable"
      ],
      timeline: "Pre-award and throughout contract lifecycle",
      notes: "More risk/governance driven with national implementation variation"
    }
  ],
  "itar vs eu dual-use": [
    {
      jurisdiction: "US",
      framework: "ITAR",
      obligations: [
        "USML classification",
        "License/TAA/MLA evaluation",
        "US person and deemed export controls",
        "5-year recordkeeping"
      ],
      timeline: "Before export or technical transfer",
      notes: "Strict extra-territorial reach for defense articles/data"
    },
    {
      jurisdiction: "EU",
      framework: "EU Dual-Use Regulation (EU) 2021/821",
      obligations: [
        "Dual-use classification",
        "Member-state licensing",
        "End-use/end-user controls",
        "Catch-all controls in sensitive contexts"
      ],
      timeline: "Before transfer/export",
      notes: "Implemented by member-state authorities with national procedures"
    }
  ],
  "breach notification": [
    {
      jurisdiction: "US",
      framework: "DFARS 252.204-7012",
      obligations: [
        "Report cyber incidents within 72 hours",
        "Preserve and protect images/logs for damage assessment",
        "Submit report via DoD reporting mechanism"
      ],
      timeline: "72 hours",
      notes: "Applies when covered defense information is impacted"
    },
    {
      jurisdiction: "SE",
      framework: "Contractual/national defense reporting + NATO handling incident channels",
      obligations: [
        "Immediate contractual and authority notification (if required)",
        "Coordinate with national security authority",
        "Containment and classified handling investigation"
      ],
      timeline: "Typically immediate/contract-defined",
      notes: "No single DFARS-equivalent statutory timeline; contractual and national security controls dominate"
    }
  ]
};

const breachObligations = {
  US: {
    cui: [
      {
        recipient: "DoD via DFARS incident portal",
        deadline: "72 hours",
        content_requirements: [
          "Incident description",
          "Affected covered defense information scope",
          "Compromise indicators",
          "Forensic preservation confirmation"
        ],
        penalties: "Potential contract remedies and enforcement action"
      }
    ],
    "itar-controlled": [
      {
        recipient: "DDTC (as required by voluntary disclosure context)",
        deadline: "Promptly after discovery",
        content_requirements: [
          "Nature of potential unauthorized export/disclosure",
          "Parties involved",
          "Corrective actions"
        ],
        penalties: "Civil/criminal penalties under AECA/ITAR"
      }
    ]
  },
  NATO: {
    "nato-classified": [
      {
        recipient: "National security authority + originating authority + relevant NATO channels",
        deadline: "Immediate",
        content_requirements: [
          "Classification and caveat impact",
          "Impacted coalition dissemination paths",
          "Containment and revocation actions",
          "Cross-border notification confirmation"
        ],
        penalties: "National security enforcement actions, contract remedies, and coalition access restrictions"
      }
    ]
  },
  EU: {
    "nato-classified": [
      {
        recipient: "National security authority + affected mission partners",
        deadline: "Immediate",
        content_requirements: [
          "Classification/caveat impact",
          "Affected information sharing channels",
          "Containment and dissemination controls",
          "Cross-border notification status"
        ],
        penalties: "National enforcement and contractual/security sanctions"
      }
    ],
    "ear-controlled": [
      {
        recipient: "Member-state export control authority",
        deadline: "Without undue delay",
        content_requirements: [
          "Item classification context",
          "Destination/end-user impact",
          "Corrective and containment actions"
        ],
        penalties: "Administrative and criminal export-control penalties vary by member state"
      }
    ],
    "itar-controlled": [
      {
        recipient: "Competent export authority + US originator/licensing counterpart",
        deadline: "Without undue delay",
        content_requirements: [
          "US-origin technical data exposure details",
          "Potential unauthorized transfer scope",
          "Corrective measures and transfer controls"
        ],
        penalties: "EU member-state enforcement plus US-origin export consequences"
      }
    ]
  },
  SE: {
    "nato-classified": [
      {
        recipient: "Swedish national security authority and contracting authority",
        deadline: "Immediate / contract-defined",
        content_requirements: ["Classification level impacted", "Containment actions", "Potential cross-border impact"],
        penalties: "Contractual sanctions and national security enforcement"
      }
    ],
    cui: [
      {
        recipient: "Prime contractor and designated authority",
        deadline: "Contract-defined (typically immediate)",
        content_requirements: ["CUI equivalent impact", "Flowdown impact", "Remediation plan"],
        penalties: "Contractual penalties"
      }
    ]
  },
  NL: {
    "nato-classified": [
      {
        recipient: "Dutch security authority and relevant NATO channels",
        deadline: "Immediate",
        content_requirements: ["Incident scope", "classification metadata", "partner notification status"],
        penalties: "Contract and security authority actions"
      }
    ]
  }
};

const controlBaselines = {
  default: [
    {
      control_id: "AC-3",
      title: "Access Enforcement",
      priority: "high",
      rationale: "Primary safeguard across CUI, export-controlled, and classified handling environments",
      regulation_basis: ["NIST SP 800-171", "NISPOM"],
      standard_basis: ["NIST_SP_800_171", "CNSSI_1253"]
    },
    {
      control_id: "AU-6",
      title: "Audit Review and Analysis",
      priority: "high",
      rationale: "Required for insider and supply-chain threat detection and post-incident evidence",
      regulation_basis: ["DFARS 252.204-7012"],
      standard_basis: ["NIST_SP_800_171", "NIST_SP_800_53_DOD_OVERLAY"]
    },
    {
      control_id: "IR-4",
      title: "Incident Handling",
      priority: "high",
      rationale: "Required to meet reporting timelines and mission continuity obligations",
      regulation_basis: ["DFARS 252.204-7012"],
      standard_basis: ["NIST_SP_800_171"]
    },
    {
      control_id: "SC-7",
      title: "Boundary Protection",
      priority: "high",
      rationale: "Critical for CDS, enclave, and supplier boundary integrity",
      regulation_basis: ["NISPOM", "NATO security policy"],
      standard_basis: ["CNSSI_1253", "NATO_STANAG_4774"]
    },
    {
      control_id: "MP-7",
      title: "Media Protection",
      priority: "medium",
      rationale: "Protects against removable-media compromise and uncontrolled transfer",
      regulation_basis: ["NISPOM", "CMMC 2.0"],
      standard_basis: ["NIST_SP_800_171"]
    },
    {
      control_id: "CM-8",
      title: "Asset Inventory",
      priority: "medium",
      rationale: "Essential for supply-chain and CMMC auditability",
      regulation_basis: ["CMMC 2.0"],
      standard_basis: ["NIST_SP_800_171"]
    }
  ],
  l3_enhanced: [
    {
      control_id: "SR-3",
      title: "Supply Chain Controls and Countermeasure Planning",
      priority: "high",
      rationale: "Enhanced protection for highest-priority CUI programs",
      regulation_basis: ["CMMC Level 3", "NIST SP 800-172"],
      standard_basis: ["NIST_SP_800_172"]
    },
    {
      control_id: "SI-7",
      title: "Software/Firmware Integrity",
      priority: "high",
      rationale: "Detects mission-critical tampering and malicious updates",
      regulation_basis: ["NIST SP 800-172"],
      standard_basis: ["NIST_SP_800_172", "DO_356A"]
    }
  ]
};

const expertPlaybooks = [
  {
    id: "pb-cmmc-l2-boundary-scoping",
    name: "CMMC Level 2 Boundary Scoping",
    scenario:
      "Prime or subcontractor handling CUI needs defensible boundary definition for Level 2 readiness.",
    jurisdictions: ["US", "US-*"],
    data_types: ["cui", "fci"],
    when_to_use: [
      "DoD contract requires CMMC attestation or third-party assessment",
      "Multiple enclaves or shared services create scoping ambiguity"
    ],
    steps: [
      "Inventory in-scope assets, identities, data stores, and external dependencies touching CUI.",
      "Map CUI data flows end-to-end and define trust boundaries for each transfer.",
      "Assign NIST SP 800-171 control ownership and inherited/shared service responsibilities.",
      "Create SSP boundary narrative aligned to control implementation evidence.",
      "Validate flowdown and supplier boundary assumptions for subcontracted services."
    ],
    common_failure_modes: [
      "Unscoped admin systems still touching CUI paths",
      "MFA and logging controls implemented outside documented boundary",
      "Supplier-managed services missing inherited-control evidence"
    ],
    evidence_outputs: [
      "System Security Plan boundary section",
      "CUI data flow diagrams",
      "Shared service responsibility matrix",
      "Asset inventory with in-scope tags"
    ],
    regulation_basis: [
      { regulation_id: "CMMC_2_0", section: "Level 2 scoping and controls" },
      { regulation_id: "DFARS_252.204-7012", section: "(b) adequate security" }
    ],
    citations: [
      {
        type: "CFR",
        ref: "32 CFR Part 170",
        source_url: "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program"
      },
      {
        type: "DFARS",
        ref: "252.204-7012",
        source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting"
      }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-deemed-export-decision-flow",
    name: "Deemed Export Decision Flow",
    scenario:
      "Assess foreign national access to controlled technical data in engineering, support, or cloud admin workflows.",
    jurisdictions: ["US", "EU", "UK"],
    data_types: ["itar-controlled", "ear-controlled", "weapons-system-data"],
    when_to_use: [
      "Onboarding non-US persons to controlled programs",
      "Remote support models with transnational access paths"
    ],
    steps: [
      "Classify item/data as ITAR, EAR, or mixed-origin controlled content.",
      "Determine whether visual, oral, or system-mediated access constitutes export.",
      "Evaluate license, exception, or agreement pathway (for example TAA/MLA or ENC eligibility).",
      "Apply nationality- and role-based access constraints before enabling access.",
      "Document legal basis, approvals, and monitoring controls in export decision record."
    ],
    common_failure_modes: [
      "Assuming read-only access is not an export event",
      "No persistent record linking user access to export authorization decision",
      "Cloud admin break-glass paths bypass nationality restrictions"
    ],
    evidence_outputs: [
      "Export classification worksheet",
      "Technology control plan access matrix",
      "Approved user nationality register",
      "Audit logs of controlled-data access"
    ],
    regulation_basis: [
      { regulation_id: "ITAR_22_CFR_120_130", section: "deemed export context" },
      { regulation_id: "EAR_15_CFR_730_774", section: "deemed export and license logic" }
    ],
    citations: [
      {
        type: "CFR",
        ref: "22 CFR 120-130",
        source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M"
      },
      {
        type: "CFR",
        ref: "15 CFR 730-774",
        source_url: "https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C"
      }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-nato-classified-sharing-release",
    name: "NATO Classified Sharing Release Control",
    scenario:
      "Coalition information exchange for NATO classified artifacts across multiple member states.",
    jurisdictions: ["NATO", "SE", "NL", "DE", "NO", "UK", "US"],
    data_types: ["nato-classified", "national-classified"],
    when_to_use: [
      "Cross-border mission data sharing with NATO caveats",
      "Standing up new coalition exchange channels"
    ],
    steps: [
      "Validate classification, caveats, and originator control requirements.",
      "Confirm participant organization and personnel clearance eligibility per national authority.",
      "Apply STANAG 4774 labels and STANAG 4778 binding to exchanged artifacts.",
      "Enforce release and onward-transfer policy in CDS and messaging gateways.",
      "Log dissemination decisions and exception approvals for post-event accountability."
    ],
    common_failure_modes: [
      "Missing caveat metadata in downstream systems",
      "Onward transfer without explicit originator approval",
      "Divergent national release interpretations without documented adjudication"
    ],
    evidence_outputs: [
      "Release authorization log",
      "Caveat registry and metadata policy",
      "Participant clearance verification package",
      "Cross-domain gateway policy baseline"
    ],
    regulation_basis: [
      { regulation_id: "NATO_C_M_2002_49", section: "security principles" },
      { regulation_id: "NATO_FSC_HANDLING", section: "facility and handling obligations" }
    ],
    citations: [
      {
        type: "NATO",
        ref: "C-M(2002)49",
        source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm"
      },
      {
        type: "NATO",
        ref: "STANAG 4774/4778",
        source_url: "https://nso.nato.int"
      }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-dfars-72h-incident",
    name: "DFARS 72-Hour Incident Reporting",
    scenario:
      "Cyber incident in environment handling covered defense information requires immediate reporting and evidence preservation.",
    jurisdictions: ["US", "US-*"],
    data_types: ["cui", "supply-chain-data"],
    when_to_use: [
      "Suspected compromise of CUI systems or supplier-managed controlled environments",
      "Ransomware or data exfiltration with uncertain CUI impact"
    ],
    steps: [
      "Trigger incident triage and determine whether covered defense information may be affected.",
      "Preserve forensic artifacts and maintain chain-of-custody records.",
      "Submit DoD cyber incident report within 72 hours with required indicators and scope details.",
      "Coordinate subcontractor flowdown reporting and contractual notifications.",
      "Capture corrective actions and residual risk decisions for post-incident review."
    ],
    common_failure_modes: [
      "Late determination of CUI impact causing missed reporting window",
      "Forensic data overwritten before preservation",
      "Supplier incidents not propagated to prime reporting workflow"
    ],
    evidence_outputs: [
      "Incident report submission record",
      "Forensic preservation log",
      "Timeline of detection/containment actions",
      "Post-incident corrective action plan"
    ],
    regulation_basis: [
      { regulation_id: "DFARS_252.204-7012_INCIDENT", section: "(d)-(e)" },
      { regulation_id: "CMMC_2_0", section: "incident response practices" }
    ],
    citations: [
      {
        type: "DFARS",
        ref: "252.204-7012(d)-(e)",
        source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting"
      }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-counterfeit-supply-chain-response",
    name: "Counterfeit Part and Supplier Compromise Response",
    scenario:
      "Potential counterfeit insertion or supplier compromise impacting mission-critical components.",
    jurisdictions: ["US", "EU", "NATO"],
    data_types: ["supply-chain-data", "weapons-system-data", "program-protection"],
    when_to_use: [
      "Parts provenance discrepancies or integrity anomalies detected",
      "Supplier cyber event affects controlled engineering artifacts"
    ],
    steps: [
      "Quarantine suspect parts, builds, and dependent production lots.",
      "Validate provenance, traceability, and acceptance-test evidence against approved source list.",
      "Assess mission/safety impact and notify program security and quality authorities.",
      "Initiate supplier corrective action with flowdown and security remediation milestones.",
      "Update SCRM controls and prevent recurrence via receiving and test controls."
    ],
    common_failure_modes: [
      "No single traceability record from procurement to deployment",
      "Supplier corrective actions lack objective closure criteria",
      "Engineering exceptions bypass security sign-off"
    ],
    evidence_outputs: [
      "Chain-of-custody and provenance package",
      "Non-conformance and quarantine records",
      "Supplier corrective action report",
      "Updated approved supplier baseline"
    ],
    regulation_basis: [
      { regulation_id: "DFARS_252.246-7008", section: "counterfeit controls" },
      { regulation_id: "DoDI_4140.67", section: "prevention and detection" }
    ],
    citations: [
      { type: "DFARS", ref: "252.246-7008", source_url: "https://www.acquisition.gov/dfars" },
      { type: "DODI", ref: "4140.67", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-program-protection-cpi",
    name: "Critical Program Information Protection",
    scenario:
      "Program offices and OEMs need repeatable protection workflow for CPI across design and sustainment lifecycle.",
    jurisdictions: ["US", "UK", "SE", "DE", "NL"],
    data_types: ["program-protection", "weapons-system-data"],
    when_to_use: [
      "New major defense acquisition phase starts",
      "Threat intelligence indicates targeting of key CPI elements"
    ],
    steps: [
      "Identify and prioritize CPI elements and mission-critical functions.",
      "Map threat vectors across development, integration, test, and sustainment.",
      "Select and tailor anti-tamper, access, monitoring, and supply-chain controls.",
      "Integrate protection controls into safety and mission assurance engineering processes.",
      "Reassess CPI exposure after architecture, supplier, or mission profile changes."
    ],
    common_failure_modes: [
      "CPI catalog not updated after design evolution",
      "Protection controls documented but not verified in operational contexts",
      "Disconnect between cyber protection and system safety decisions"
    ],
    evidence_outputs: [
      "Program protection plan extracts",
      "CPI prioritization register",
      "Protection control verification evidence",
      "Mission impact and residual risk register"
    ],
    regulation_basis: [
      { regulation_id: "DODI_5200_39", section: "CPI identification and protection" },
      { regulation_id: "MIL_STD_882", section: "risk integration" }
    ],
    citations: [
      { type: "DODI", ref: "5200.39", source_url: "https://www.esd.whs.mil/DD/DoD-Issuances/DoD-Issuances-Website/" },
      { type: "MIL", ref: "MIL-STD-882", source_url: "https://quicksearch.dla.mil" }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-airworthiness-cyber-assurance",
    name: "Airworthiness Cyber Assurance Workflow",
    scenario:
      "Aircraft/UAV programs need certification-ready cybersecurity lifecycle evidence.",
    jurisdictions: ["US", "EU", "UK"],
    data_types: ["weapons-system-data", "program-protection"],
    when_to_use: [
      "Platform software baseline changes affecting safety-critical functions",
      "Certification or recertification package development"
    ],
    steps: [
      "Perform aircraft system security risk assessment tied to mission and safety functions.",
      "Define security requirements and verification strategy across avionics and support systems.",
      "Execute verification activities and collect objective evidence for security claims.",
      "Track vulnerabilities and continued airworthiness actions across lifecycle updates.",
      "Maintain traceable linkage from threats to mitigations to certification artifacts."
    ],
    common_failure_modes: [
      "Security verification not tied to specific airworthiness claims",
      "Patch and update strategy not aligned to continued airworthiness constraints",
      "Ground segment and airborne segment assessed in isolation"
    ],
    evidence_outputs: [
      "Security risk assessment package",
      "Verification and validation evidence matrix",
      "Vulnerability management and update strategy",
      "Certification traceability report"
    ],
    regulation_basis: [
      { regulation_id: "AIRWORTHINESS_CYBER", section: "DO-326A lifecycle" },
      { regulation_id: "DO_356A", section: "methods and considerations" }
    ],
    citations: [
      { type: "RTCA", ref: "DO-326A", source_url: "https://www.rtca.org" },
      { type: "RTCA", ref: "DO-356A", source_url: "https://www.rtca.org" }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-us-eu-controlled-transfer",
    name: "US-EU Controlled Technology Transfer Alignment",
    scenario:
      "US-origin controlled technology transfer to EU/NATO partner with dual US+EU compliance obligations.",
    jurisdictions: ["US", "EU", "NATO", "UK"],
    data_types: ["itar-controlled", "ear-controlled", "cui"],
    when_to_use: [
      "Program requires shared engineering collaboration across US and EU entities",
      "Need to align TAA/MLA constraints with EU dual-use and national authority controls"
    ],
    steps: [
      "Determine US origin classification and transfer authorization requirements.",
      "Map receiving-country dual-use and national security authority obligations.",
      "Define segmented collaboration architecture enforcing least-privilege and lawful transfer basis.",
      "Implement transfer logging, label enforcement, and recipient control attestations.",
      "Conduct periodic compliance reviews for scope drift, supplier changes, and personnel moves."
    ],
    common_failure_modes: [
      "Relying on US authorization without validating recipient-side authority process",
      "No technical enforcement of transfer scope in shared repositories",
      "Supplier onboarding bypasses transfer control attestations"
    ],
    evidence_outputs: [
      "Cross-border transfer decision register",
      "Recipient authority and approval records",
      "Transfer-control architecture and policy package",
      "Periodic compliance review reports"
    ],
    regulation_basis: [
      { regulation_id: "ITAR_22_CFR_120_130", section: "authorization and retransfer constraints" },
      { regulation_id: "EU_DUAL_USE", section: "classification and licensing" }
    ],
    citations: [
      { type: "CFR", ref: "22 CFR 120-130", source_url: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M" },
      { type: "EU", ref: "Regulation (EU) 2021/821", source_url: "https://eur-lex.europa.eu/eli/reg/2021/821/oj" }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-foci-mitigation-assessment",
    name: "FOCI Mitigation and Governance Assessment",
    scenario:
      "Entity with foreign ownership, control, or influence requires facility clearance or access to classified programs.",
    jurisdictions: ["US"],
    data_types: ["national-classified", "program-protection", "cui"],
    when_to_use: [
      "Foreign investment or M&A involving cleared contractor",
      "Joint venture or teaming arrangement with foreign-owned entity",
      "DCSA FOCI determination or annual review"
    ],
    steps: [
      "Assess foreign ownership, control, or influence factors per NISPOM criteria.",
      "Determine appropriate FOCI mitigation instrument (SSA, SCA, proxy agreement, VTA).",
      "Establish Government Security Committee and outside director governance structure.",
      "Implement technology control plan and electronic communications plan as required.",
      "Submit FOCI package to DCSA and maintain ongoing compliance monitoring."
    ],
    common_failure_modes: [
      "Incomplete disclosure of beneficial ownership chains to DCSA",
      "Technology control plan not enforced for visiting foreign nationals",
      "GSC oversight lapses during corporate restructuring events"
    ],
    evidence_outputs: [
      "FOCI package and mitigation instrument",
      "Technology control plan",
      "Electronic communications plan",
      "GSC meeting minutes and annual compliance certification"
    ],
    regulation_basis: [
      { regulation_id: "32_CFR_PART_117_NISPOM", section: "FOCI provisions" },
      { regulation_id: "DCSA_FOCI", section: "mitigation requirements" }
    ],
    citations: [
      { type: "CFR", ref: "32 CFR Part 117", source_url: "https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-D/part-117" }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-cross-domain-solution-accreditation",
    name: "Cross-Domain Solution Accreditation Workflow",
    scenario:
      "Standing up or accrediting a cross-domain solution for controlled information transfer between security domains.",
    jurisdictions: ["US", "NATO", "UK"],
    data_types: ["national-classified", "nato-classified", "cui"],
    when_to_use: [
      "Mission architecture requires data transfer between classification levels or domains",
      "Coalition operations need controlled release across national boundaries"
    ],
    steps: [
      "Define cross-domain transfer requirements including data types, direction, and volume.",
      "Select NCDSMO-listed or NCIA-approved CDS product for the required security domain pair.",
      "Develop transfer policy, content filtering rules, and label-enforcement mechanisms.",
      "Prepare accreditation package including security architecture, risk assessment, and test evidence.",
      "Obtain Authorizing Official (AO) or national security authority approval with conditions of operation."
    ],
    common_failure_modes: [
      "Filter policy does not cover all data types in production traffic",
      "CDS product version drift without re-accreditation",
      "Insufficient monitoring and audit of cross-domain transfer events"
    ],
    evidence_outputs: [
      "CDS architecture and security design document",
      "Transfer policy and content filtering rules",
      "Risk assessment and residual risk acceptance",
      "Accreditation decision letter and conditions"
    ],
    regulation_basis: [
      { regulation_id: "CNSSP_24", section: "cross-domain policy" },
      { regulation_id: "NATO_C_M_2002_49", section: "cross-domain requirements" }
    ],
    citations: [
      { type: "CNSS", ref: "CNSSP-24", source_url: "https://www.cnss.gov" },
      { type: "NATO", ref: "C-M(2002)49", source_url: "https://www.nato.int/cps/en/natohq/topics_50090.htm" }
    ],
    last_verified: LAST_UPDATED
  },
  {
    id: "pb-cloud-cui-migration",
    name: "Cloud Migration for CUI Workloads",
    scenario:
      "Migrating defense contractor CUI workloads to cloud infrastructure while maintaining CMMC and DFARS compliance.",
    jurisdictions: ["US", "US-*"],
    data_types: ["cui", "fci", "supply-chain-data"],
    when_to_use: [
      "Moving on-premises CUI systems to GCC High, IL4, or IL5 cloud",
      "Evaluating CSP authorization status for defense contract requirements"
    ],
    steps: [
      "Verify CSP holds FedRAMP High authorization and DoD provisional authorization at required impact level.",
      "Map existing SSP boundary controls to cloud shared responsibility model.",
      "Define CUI data residency, encryption at rest and in transit, and key management architecture.",
      "Implement identity federation, privileged access controls, and continuous monitoring telemetry.",
      "Update SSP, POA&M, and assessment evidence to reflect cloud-hosted control implementation."
    ],
    common_failure_modes: [
      "Assuming CSP authorization covers all tenant-level control responsibilities",
      "Missing encryption key management and data residency contractual terms",
      "Break-glass and admin access paths not restricted to US persons",
      "Assessment evidence references on-premises controls no longer in scope"
    ],
    evidence_outputs: [
      "Cloud SSP addendum with shared responsibility matrix",
      "CSP authorization and PA/ATO documentation",
      "Data residency and encryption architecture",
      "Updated POA&M and continuous monitoring plan"
    ],
    regulation_basis: [
      { regulation_id: "CMMC_2_0", section: "cloud-hosted CUI controls" },
      { regulation_id: "DFARS_252.204-7012", section: "(b)(2)(ii) cloud computing" }
    ],
    citations: [
      { type: "CFR", ref: "32 CFR Part 170", source_url: "https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program" },
      { type: "DFARS", ref: "252.204-7012", source_url: "https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting" }
    ],
    last_verified: LAST_UPDATED
  }
];

module.exports = {
  DATASET_VERSION,
  EFFECTIVE_DATE,
  LAST_UPDATED,
  KNOWLEDGE_BASELINE,
  EU_MEMBER_STATE_CODES,
  EU_COUNTRY_NAME_TO_CODE,
  EU_NATO_MEMBER_CODES,
  NATO_MEMBER_CODES,
  NATO_COUNTRY_NAME_TO_CODE,
  US_STATE_CODES,
  clauseReferenceLibrary,
  sources,
  architecturePatterns,
  dataCategories,
  threatScenarios,
  technicalStandards,
  applicabilityRules,
  evidenceArtifacts,
  jurisdictionComparisons,
  jurisdictionProfiles,
  breachObligations,
  controlBaselines,
  expertPlaybooks
};
