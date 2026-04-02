module.exports = {
  BASE_URL: 'https://sme-business-web.vercel.app',

  ROUTES: {
    HOME: '/',
    QUOTE_START: '/quote/start',
    AI_ADVISOR: '/quote/ai-advisor',
    MANUAL: '/quote/manual',
    UPLOAD: '/quote/upload',
    RESULTS: '/quote/results',
    COMPANY_DETAILS: '/quote/company-details',
    CONFIRMATION: '/quote/confirmation',
    CHECKOUT: '/quote/checkout',
  },

  EMPLOYEES: {
    JUST_ME: 'Just me',
    TWO_TO_FIVE: '2–5',
    SIX_TO_TWENTY: '6–20',
    TWENTY_ONE_TO_FIFTY: '21–50',
    FIFTY_ONE_TO_HUNDRED: '51–100',
    HUNDRED_PLUS: '100+',
  },

  REVENUE: {
    UNDER_500K: 'Under AED 500,000',
    FIVE_HUNDRED_K_TO_1M: 'AED 500K – 1 million',
    ONE_M_TO_5M: 'AED 1M – 5 million',
    FIVE_M_TO_10M: 'AED 5M – 10 million',
    OVER_10M: 'Over AED 10 million',
  },

  BUSINESS_TYPES: [
    'Café / Restaurant',
    'Law Firm / Legal',
    'Retail / Trading',
    'IT / Technology',
    'Construction / Contracting',
    'Healthcare / Clinic',
    'Consulting / Advisory',
    'General Trading',
    'Logistics / Transport',
    'Real Estate',
  ],

  STEP_LABELS: {
    CHOOSE_METHOD: 'Step 1 of 7',
    BUSINESS_DETAILS: 'Step 2 of 7',
  },
};
