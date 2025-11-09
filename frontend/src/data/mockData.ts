export const accounts = [
  {
    id: 1,
    number: "3200 9988 1122 4455",
    name: "Primary Checking",
    type: "Checking",
    balance: 15230.45,
    currency: "USD",
    status: "Active",
    lastActivity: "2025-11-02",
  },
  {
    id: 2,
    number: "3200 9988 1122 5522",
    name: "High-Yield Savings",
    type: "Savings",
    balance: 48250.12,
    currency: "USD",
    status: "Active",
    lastActivity: "2025-11-01",
  },
  {
    id: 3,
    number: "3200 9988 1122 8899",
    name: "Corporate Credit",
    type: "Credit",
    balance: -3120.65,
    currency: "USD",
    status: "Active",
    lastActivity: "2025-11-03",
  },
];

export const transactions = [
  {
    id: 901,
    account: "Primary Checking",
    type: "Transfer Out",
    amount: -450.0,
    reference: "Rent payment",
    counterparty: "ACME Properties",
    createdAt: "2025-11-03 09:45",
  },
  {
    id: 902,
    account: "High-Yield Savings",
    type: "Interest",
    amount: 38.75,
    reference: "Monthly interest",
    counterparty: "BankPro",
    createdAt: "2025-11-02 17:25",
  },
  {
    id: 903,
    account: "Primary Checking",
    type: "Transfer In",
    amount: 1250.0,
    reference: "Salary",
    counterparty: "Northwind HQ",
    createdAt: "2025-11-01 08:00",
  },
  {
    id: 904,
    account: "Corporate Credit",
    type: "Card Payment",
    amount: -220.5,
    reference: "Software tools",
    counterparty: "Contoso Cloud",
    createdAt: "2025-10-31 22:14",
  },
];

export const reports = {
  balances: [
    { label: "Checking", value: 15230.45 },
    { label: "Savings", value: 48250.12 },
    { label: "Credit", value: -3120.65 },
  ],
  transfers: [
    { label: "Incoming", value: 18250 },
    { label: "Outgoing", value: 13210 },
  ],
  risk: [
    { label: "Low", value: 62 },
    { label: "Medium", value: 28 },
    { label: "High", value: 10 },
  ],
};

export const cashflow = [
  { date: "2025-10-29", inflow: 3200, outflow: 2100 },
  { date: "2025-10-30", inflow: 2850, outflow: 2600 },
  { date: "2025-10-31", inflow: 1980, outflow: 2400 },
  { date: "2025-11-01", inflow: 4500, outflow: 3100 },
  { date: "2025-11-02", inflow: 2750, outflow: 1800 },
  { date: "2025-11-03", inflow: 3625, outflow: 2900 },
  { date: "2025-11-04", inflow: 4100, outflow: 3350 },
];

export const users = [
  {
    id: 1,
    name: "Priya Patel",
    email: "priya.patel@bankpro.com",
    role: "Relationship Manager",
    status: "Active",
    lastLogin: "2025-11-03 08:25",
  },
  {
    id: 2,
    name: "Michael Lee",
    email: "michael.lee@bankpro.com",
    role: "Risk Analyst",
    status: "On leave",
    lastLogin: "2025-10-28 14:12",
  },
];

export const userProfiles = [
  {
    id: 1,
    name: "Priya Patel",
    title: "Premier Banking Client",
    email: "priya.patel@bankpro.com",
    phone: "+1 (312) 555-0199",
    kycStatus: "Approved",
    kycDocuments: [
      { id: "kyc-001", name: "Passport.pdf", verifiedAt: "2025-08-14" },
      { id: "kyc-002", name: "Utility-Bill.pdf", verifiedAt: "2025-08-16" },
    ],
    lastLogin: "2025-11-03 08:25",
    lastLoginIp: "192.168.0.14",
    lastDevice: "iPhone 15 Pro",
    accounts: [
      { id: "ACC-3201", type: "Checking", balance: 15230.45, currency: "USD", status: "Active" },
      { id: "ACC-3202", type: "Savings", balance: 48250.12, currency: "USD", status: "Active" },
    ],
    alerts: ["Low balance alert disabled", "2FA enabled"],
    spendingBreakdown: [
      { category: "Housing", amount: 2100 },
      { category: "Dining", amount: 540 },
      { category: "Travel", amount: 980 },
      { category: "Subscriptions", amount: 260 },
    ],
    flaggedTransactions: 1,
    activity: [
      { id: "act-01", timestamp: "2025-11-03 08:25", description: "Logged in from new device" },
      { id: "act-02", timestamp: "2025-11-02 17:25", description: "Scheduled payment executed" },
      { id: "act-03", timestamp: "2025-11-01 08:00", description: "Salary credited" },
    ],
  },
  {
    id: 2,
    name: "Michael Lee",
    title: "Corporate Client",
    email: "michael.lee@bankpro.com",
    phone: "+1 (415) 555-0118",
    kycStatus: "Pending Review",
    kycDocuments: [
      { id: "kyc-101", name: "National-ID.pdf", verifiedAt: "2025-06-04" },
    ],
    lastLogin: "2025-10-28 14:12",
    lastLoginIp: "10.0.1.88",
    lastDevice: "MacBook Pro",
    accounts: [
      { id: "ACC-4201", type: "Credit", balance: -3120.65, currency: "USD", status: "Frozen" },
      { id: "ACC-4202", type: "Checking", balance: 8650.0, currency: "USD", status: "Active" },
    ],
    alerts: ["Pending KYC verification", "High-risk transaction flagged"],
    spendingBreakdown: [
      { category: "Software", amount: 1220 },
      { category: "Travel", amount: 1780 },
      { category: "Equipment", amount: 3400 },
      { category: "Misc", amount: 450 },
    ],
    flaggedTransactions: 3,
    activity: [
      { id: "act-10", timestamp: "2025-10-28 14:12", description: "Login via VPN" },
      { id: "act-11", timestamp: "2025-10-27 19:45", description: "High-value transfer pending" },
      { id: "act-12", timestamp: "2025-10-26 11:30", description: "KYC refresh requested" },
    ],
  },
];

export const scheduledTransfers = [
  {
    id: "T-3201",
    fromAccount: "Primary Checking",
    toAccount: "High-Yield Savings",
    amount: 500,
    currency: "USD",
    scheduledFor: "2025-11-05 08:00",
    status: "Approved",
  },
  {
    id: "T-3202",
    fromAccount: "Corporate Credit",
    toAccount: "Primary Checking",
    amount: 750,
    currency: "USD",
    scheduledFor: "2025-11-06 12:30",
    status: "Pending",
  },
];

export const adminAccounts = [
  {
    id: "A-1101",
    owner: "Priya Patel",
    account: "Primary Checking",
    status: "Active",
    risk: "Low",
    opened: "2021-03-12",
  },
  {
    id: "A-1102",
    owner: "Michael Lee",
    account: "Corporate Credit",
    status: "Active",
    risk: "Medium",
    opened: "2022-07-25",
  },
  {
    id: "A-1103",
    owner: "Lena Nguyen",
    account: "High-Yield Savings",
    status: "Frozen",
    risk: "High",
    opened: "2023-11-04",
  },
];
