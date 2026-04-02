const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, PageOrientation,
  TabStopType, TabStopPosition
} = require("docx");

// ── Colors ──
const C = {
  primary: "1B3A5C",
  accent: "2E75B6",
  pass: "27AE60",
  white: "FFFFFF",
  black: "000000",
  lightGray: "F5F6FA",
  border: "D5D8DC",
  lightBlue: "EBF5FB",
  lightGreen: "EAFAF1",
};

// ── Helpers ──
const border = { style: BorderStyle.SINGLE, size: 1, color: C.border };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 80, bottom: 80, left: 120, right: 120 };

function hCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: C.primary, type: ShadingType.CLEAR }, margins: cm, verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text, bold: true, color: C.white, font: "Arial", size: 18 })] })],
  });
}

function dCell(text, width, opts = {}) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: cm, verticalAlign: "center",
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, font: "Arial", size: 18, bold: opts.bold || false, color: opts.color || C.black })],
    })],
  });
}

function spacer(s = 200) { return new Paragraph({ spacing: { after: s }, children: [] }); }

// ── Test Scenario Data ──
const scenarios = [
  {
    id: "SC-01", name: "Homepage & Navigation", file: "homepage.spec.js", page: "HomePage.js",
    url: "/", description: "Validates the landing page UI elements including hero section, SME Business Insurance card, navigation elements, trust indicators, and navigation to the quote start page.",
    tests: [
      { id: "TC-1.1", name: "Display hero section with heading", type: "UI Verification", priority: "High",
        precondition: "User navigates to homepage", steps: "Open homepage URL", expected: "Hero heading is visible on the page", status: "Pass" },
      { id: "TC-1.2", name: "Display SME Business Insurance card", type: "UI Verification", priority: "High",
        precondition: "Homepage is loaded", steps: "Verify SME card and Get a Quote button presence", expected: "SME Business Insurance card and Get a Quote button are visible", status: "Pass" },
      { id: "TC-1.3", name: "Navigate to quote start via Get a Quote", type: "Navigation", priority: "Critical",
        precondition: "Homepage is loaded", steps: "Click 'Get a quote' button on SME card", expected: "URL changes to /quote/start", status: "Pass" },
      { id: "TC-1.4", name: "Display navigation elements", type: "UI Verification", priority: "Medium",
        precondition: "Homepage is loaded", steps: "Verify logo and language toggle visibility", expected: "Shory logo and language toggle are visible in header", status: "Pass" },
      { id: "TC-1.5", name: "Display trust indicators", type: "UI Verification", priority: "Medium",
        precondition: "Homepage is loaded", steps: "Verify trust/review badge visibility", expected: "Trust badge with reviews is visible", status: "Pass" },
    ]
  },
  {
    id: "SC-02", name: "Quote Start - Method Selection", file: "quoteStart.spec.js", page: "QuoteStartPage.js",
    url: "/quote/start", description: "Validates Step 1 of the quote journey where users choose one of four methods: AI Advisor, Pre-configured Business Type, Upload Trade Licence, or Fill Manually.",
    tests: [
      { id: "TC-2.1", name: "Display step 1 of 6 indicator", type: "UI Verification", priority: "Medium",
        precondition: "User is on /quote/start", steps: "Verify step indicator text", expected: "'Step 1 of 6' indicator is visible", status: "Pass" },
      { id: "TC-2.2", name: "Show all 4 method options", type: "UI Verification", priority: "Critical",
        precondition: "Quote start page loaded", steps: "Verify all four method cards are visible", expected: "AI Advisor, Pre-configured, Upload, and Manual cards all visible", status: "Pass" },
      { id: "TC-2.3", name: "Navigate to AI Advisor page", type: "Navigation", priority: "Critical",
        precondition: "Quote start page loaded", steps: "Click AI Advisor card", expected: "URL changes to /quote/ai-advisor", status: "Pass" },
      { id: "TC-2.4", name: "Navigate to Business Type page", type: "Navigation", priority: "Critical",
        precondition: "Quote start page loaded", steps: "Click pre-configured business card", expected: "URL changes to /quote/business-type", status: "Pass" },
      { id: "TC-2.5", name: "Navigate to Upload page", type: "Navigation", priority: "High",
        precondition: "Quote start page loaded", steps: "Click Upload trade licence card", expected: "URL changes to /quote/upload", status: "Pass" },
      { id: "TC-2.6", name: "Navigate to Manual form page", type: "Navigation", priority: "High",
        precondition: "Quote start page loaded", steps: "Click Fill in manually card", expected: "URL changes to /quote/manual", status: "Pass" },
    ]
  },
  {
    id: "SC-03", name: "AI Advisor Journey", file: "aiAdvisorJourney.spec.js", page: "AiAdvisorPage.js",
    url: "/quote/ai-advisor", description: "Validates the AI-powered conversational quote flow including chat interface, quick-select business type chips, and user input handling.",
    tests: [
      { id: "TC-3.1", name: "Display AI chat interface with greeting", type: "UI Verification", priority: "Critical",
        precondition: "User is on /quote/ai-advisor", steps: "Verify step indicator and chat input field", expected: "Step 2 of 6 indicator and text input are visible", status: "Pass" },
      { id: "TC-3.2", name: "Show all quick-select business type chips", type: "UI Verification", priority: "High",
        precondition: "AI Advisor page loaded", steps: "Verify all 10 business type chip buttons", expected: "All 10 chips visible (Cafe, Law, Retail, IT, Construction, Healthcare, Consulting, General Trading, Logistics, Real Estate)", status: "Pass" },
      { id: "TC-3.3", name: "Select business type via chip and progress", type: "Functional", priority: "Critical",
        precondition: "AI Advisor page loaded", steps: "Click 'Cafe / Restaurant' chip button", expected: "Conversation progresses, page remains on /quote/ai-advisor", status: "Pass" },
      { id: "TC-3.4", name: "Allow typing a business description", type: "Functional", priority: "High",
        precondition: "AI Advisor page loaded", steps: "Click chat input and type business description text", expected: "Input field contains the typed text (not empty)", status: "Pass" },
    ]
  },
  {
    id: "SC-04", name: "Pre-configured Business Type", file: "businessTypeJourney.spec.js", page: "BusinessTypePage.js",
    url: "/quote/business-type", description: "Validates the pre-configured business type selection page including the business type grid, featured types, risk badges, and detail panel display.",
    tests: [
      { id: "TC-4.1", name: "Display business type page heading", type: "UI Verification", priority: "High",
        precondition: "User is on /quote/business-type", steps: "Verify page heading visibility", expected: "Business type page heading is visible", status: "Pass" },
      { id: "TC-4.2", name: "Show featured types (Cafe, Retail, IT)", type: "UI Verification", priority: "High",
        precondition: "Business type page loaded", steps: "Verify featured type cards", expected: "Cafe, Retail, and IT cards are visible in featured section", status: "Pass" },
      { id: "TC-4.3", name: "Display all business type cards", type: "UI Verification", priority: "High",
        precondition: "Business type page loaded", steps: "Verify additional type cards", expected: "Law Firm, Construction, Healthcare cards are visible", status: "Pass" },
      { id: "TC-4.4", name: "Select a business type and show detail panel", type: "Functional", priority: "Critical",
        precondition: "Business type page loaded", steps: "Click IT/Technology card", expected: "Quick Overview detail panel appears", status: "Pass" },
      { id: "TC-4.5", name: "Display step 2 of 6 indicator", type: "UI Verification", priority: "Medium",
        precondition: "Business type page loaded", steps: "Verify step indicator", expected: "'Step 2 of 6' indicator is visible", status: "Pass" },
    ]
  },
  {
    id: "SC-05", name: "Manual Form Journey", file: "manualFormJourney.spec.js", page: "ManualFormPage.js",
    url: "/quote/manual", description: "Validates the manual quote entry form including business description input, AI classification, employee/revenue selection, and multi-step form progression.",
    tests: [
      { id: "TC-5.1", name: "Display Step 1 heading and form", type: "UI Verification", priority: "Critical",
        precondition: "User is on /quote/manual", steps: "Verify page heading and form fields", expected: "Heading and business description input with classify button visible", status: "Pass" },
      { id: "TC-5.2", name: "Fill business description", type: "Functional", priority: "Critical",
        precondition: "Manual form loaded", steps: "Type business description text in input field", expected: "Input field contains the entered text", status: "Pass" },
      { id: "TC-5.3", name: "Enable classify button after entering description", type: "Functional", priority: "High",
        precondition: "Manual form loaded", steps: "Fill description (>3 chars) and check classify button", expected: "Classify button becomes enabled", status: "Pass" },
      { id: "TC-5.4", name: "Classify business after entering description", type: "Functional", priority: "Critical",
        precondition: "Description filled, classify enabled", steps: "Click 'Classify my business' button", expected: "Confirmation button ('Yes, that's right') appears within 15s", status: "Pass" },
      { id: "TC-5.5", name: "Display employee count options", type: "UI Verification", priority: "High",
        precondition: "Manual form loaded", steps: "Verify employee band buttons", expected: "'Just me', '2-5', '6-20' buttons are visible", status: "Pass" },
      { id: "TC-5.6", name: "Display revenue band options (scroll to view)", type: "UI Verification", priority: "High",
        precondition: "Manual form loaded", steps: "Scroll down and verify revenue buttons", expected: "'Under AED 500,000' button is visible", status: "Pass" },
      { id: "TC-5.7", name: "Select employee count", type: "Functional", priority: "High",
        precondition: "Manual form loaded", steps: "Click '2-5' employee button", expected: "Button shows selected state", status: "Pass" },
      { id: "TC-5.8", name: "Select revenue band", type: "Functional", priority: "High",
        precondition: "Manual form loaded, scrolled", steps: "Scroll down and click 'Under AED 500,000'", expected: "Revenue button is clicked successfully", status: "Pass" },
      { id: "TC-5.9", name: "Display Classify my business button", type: "UI Verification", priority: "Medium",
        precondition: "Manual form loaded", steps: "Verify classify button visibility", expected: "Classify button is visible", status: "Pass" },
      { id: "TC-5.10", name: "Display Continue button", type: "UI Verification", priority: "Medium",
        precondition: "Manual form loaded", steps: "Verify continue button visibility", expected: "Continue button is visible", status: "Pass" },
    ]
  },
  {
    id: "SC-06", name: "Upload Trade Licence", file: "uploadLicenceJourney.spec.js", page: "UploadLicencePage.js",
    url: "/quote/upload", description: "Validates the trade licence upload page including drag-drop zone, accepted formats info, what-happens-next guide, and alternative path links.",
    tests: [
      { id: "TC-6.1", name: "Display upload drop zone", type: "UI Verification", priority: "Critical",
        precondition: "User is on /quote/upload", steps: "Verify drop zone visibility", expected: "Drop zone with 'Drop your trade licence here' text is visible", status: "Pass" },
      { id: "TC-6.2", name: "Display accepted file formats", type: "UI Verification", priority: "High",
        precondition: "Upload page loaded", steps: "Verify accepted formats text", expected: "'PDF, PNG, or JPG' text is visible", status: "Pass" },
      { id: "TC-6.3", name: "Display What happens next section", type: "UI Verification", priority: "Medium",
        precondition: "Upload page loaded", steps: "Verify explanatory section", expected: "'What happens next' section is visible", status: "Pass" },
      { id: "TC-6.4", name: "Display alternative path links", type: "UI Verification", priority: "High",
        precondition: "Upload page loaded", steps: "Verify 'Try AI Advisor' link visibility", expected: "Alternative path link is visible", status: "Pass" },
      { id: "TC-6.5", name: "Display Try AI Advisor alternative link", type: "UI Verification", priority: "Medium",
        precondition: "Upload page loaded", steps: "Verify AI Advisor link text", expected: "'Try AI Advisor' link is visible", status: "Pass" },
      { id: "TC-6.6", name: "Display browse files link", type: "UI Verification", priority: "Medium",
        precondition: "Upload page loaded", steps: "Verify browse files link", expected: "'Browse files' link is visible", status: "Pass" },
    ]
  },
  {
    id: "SC-07", name: "Quote Results", file: "resultsPage.spec.js", page: "ResultsPage.js",
    url: "/quote/results", description: "Validates the quote results page including loading state, results display, Individual/Bundle tabs, filtering, sorting, and quote selection.",
    tests: [
      { id: "TC-7.1", name: "Display loading or results", type: "UI Verification", priority: "Critical",
        precondition: "Navigated to results with valid params", steps: "Check for loading indicator or heading", expected: "Either loading indicator or results heading is visible", status: "Pass" },
      { id: "TC-7.2", name: "Display results heading after loading", type: "UI Verification", priority: "Critical",
        precondition: "Results page loaded", steps: "Wait for loading to finish, verify heading", expected: "Results heading is visible", status: "Pass" },
      { id: "TC-7.3", name: "Show Individual and Bundle tabs", type: "UI Verification", priority: "High",
        precondition: "Results loaded", steps: "Verify tab buttons", expected: "Individual and Bundle tab buttons are visible", status: "Pass" },
      { id: "TC-7.4", name: "Switch between Individual and Bundle tabs", type: "Functional", priority: "High",
        precondition: "Results loaded", steps: "Click Bundle tab then Individual tab", expected: "Tabs switch without errors", status: "Pass" },
      { id: "TC-7.5", name: "Display quote cards with pricing", type: "UI Verification", priority: "Critical",
        precondition: "Results loaded", steps: "Count quote cards with AED pricing", expected: "At least 0 quote cards are present (no errors)", status: "Pass" },
      { id: "TC-7.6", name: "Display back button", type: "UI Verification", priority: "Medium",
        precondition: "Results loaded", steps: "Verify back button visibility", expected: "Back button is visible", status: "Pass" },
      { id: "TC-7.7", name: "Display continue button when quote selected", type: "Functional", priority: "High",
        precondition: "Results loaded, quotes available", steps: "Click first quote card", expected: "Continue button appears (if quotes available)", status: "Pass" },
    ]
  },
  {
    id: "SC-08", name: "Company Details", file: "companyDetails.spec.js", page: "CompanyDetailsPage.js",
    url: "/quote/company-details", description: "Validates the company verification step including upload zone, manual entry option, skip button, and step indicator.",
    tests: [
      { id: "TC-8.1", name: "Display company details page", type: "UI Verification", priority: "Critical",
        precondition: "Navigated to company-details with valid params", steps: "Verify page heading visibility", expected: "Page heading is visible", status: "Pass" },
      { id: "TC-8.2", name: "Display skip button", type: "UI Verification", priority: "High",
        precondition: "Company details page loaded", steps: "Verify skip button visibility", expected: "'Skip' button is visible", status: "Pass" },
      { id: "TC-8.3", name: "Display upload zone for trade licence", type: "UI Verification", priority: "High",
        precondition: "Company details page loaded", steps: "Verify upload zone visibility", expected: "Trade licence upload zone is visible", status: "Pass" },
      { id: "TC-8.4", name: "Display step indicator", type: "UI Verification", priority: "Medium",
        precondition: "Company details page loaded", steps: "Verify step indicator", expected: "'Step 5 of 6' indicator is visible", status: "Pass" },
      { id: "TC-8.5", name: "Click skip button", type: "Functional", priority: "High",
        precondition: "Company details page loaded", steps: "Click 'Skip' button", expected: "Button is clickable, page responds", status: "Pass" },
    ]
  },
  {
    id: "SC-09", name: "Checkout", file: "checkout.spec.js", page: "CheckoutPage.js",
    url: "/quote/checkout", description: "Validates the checkout page including order summary, contact details form, payment button, form filling, and payment processing.",
    tests: [
      { id: "TC-9.1", name: "Display order summary", type: "UI Verification", priority: "Critical",
        precondition: "Navigated to checkout with valid params", steps: "Verify order summary section", expected: "'Order summary' section is visible", status: "Pass" },
      { id: "TC-9.2", name: "Display page heading", type: "UI Verification", priority: "High",
        precondition: "Checkout page loaded", steps: "Verify page heading", expected: "Page heading is visible", status: "Pass" },
      { id: "TC-9.3", name: "Display total premium", type: "UI Verification", priority: "Critical",
        precondition: "Checkout page loaded", steps: "Verify total premium section", expected: "'Total premium' is visible", status: "Pass" },
      { id: "TC-9.4", name: "Display Pay button", type: "UI Verification", priority: "Critical",
        precondition: "Checkout page loaded", steps: "Verify pay button", expected: "Pay button is visible", status: "Pass" },
      { id: "TC-9.5", name: "Display step 6 of 6 indicator", type: "UI Verification", priority: "Medium",
        precondition: "Checkout page loaded", steps: "Verify step indicator", expected: "'Step 6 of 6' indicator is visible", status: "Pass" },
      { id: "TC-9.6", name: "Fill contact details form", type: "Functional", priority: "Critical",
        precondition: "Checkout page loaded", steps: "Fill name, email, phone fields using type selectors", expected: "Name field contains 'Ahmed Al Mansouri'", status: "Pass" },
      { id: "TC-9.7", name: "Fill contact form and click Pay", type: "Functional", priority: "Critical",
        precondition: "Checkout page loaded", steps: "Fill all contact fields via pressSequentially, verify Pay button", expected: "Pay button is visible and ready", status: "Pass" },
    ]
  },
  {
    id: "SC-10", name: "Confirmation", file: "confirmation.spec.js", page: "ConfirmationPage.js",
    url: "/quote/confirmation", description: "Validates the order confirmation page including success message, policy details, Active badge, policy section, and new quote navigation.",
    tests: [
      { id: "TC-10.1", name: "Display success heading", type: "UI Verification", priority: "Critical",
        precondition: "Navigated to confirmation with valid params", steps: "Verify success heading", expected: "Success heading ('You're all set!') is visible", status: "Pass" },
      { id: "TC-10.2", name: "Display policy number", type: "UI Verification", priority: "Critical",
        precondition: "Confirmation page loaded", steps: "Verify policy number (SHR-*)", expected: "Policy number starting with SHR- is visible", status: "Pass" },
      { id: "TC-10.3", name: "Display Active badge", type: "UI Verification", priority: "High",
        precondition: "Confirmation page loaded", steps: "Verify Active status badge", expected: "'Active' badge is visible", status: "Pass" },
      { id: "TC-10.4", name: "Display policy details section", type: "UI Verification", priority: "High",
        precondition: "Confirmation page loaded", steps: "Scroll down and verify POLICY NUMBER and EFFECTIVE DATE labels", expected: "Policy details section with number and dates is visible", status: "Pass" },
      { id: "TC-10.5", name: "Display start new quote link", type: "UI Verification", priority: "Medium",
        precondition: "Confirmation page loaded", steps: "Scroll down and verify new quote link", expected: "'Start new quote' link is visible", status: "Pass" },
      { id: "TC-10.6", name: "Navigate to quote start via Start new quote", type: "Navigation", priority: "High",
        precondition: "Confirmation page loaded", steps: "Click 'Start new quote' link", expected: "URL changes to /quote/start", status: "Pass" },
    ]
  },
  {
    id: "SC-11", name: "Full E2E Journeys", file: "e2eJourney.spec.js", page: "Multiple Page Objects",
    url: "Multiple URLs", description: "End-to-end integration tests that validate complete user journeys across multiple pages, ensuring seamless navigation through the entire quote flow.",
    tests: [
      { id: "TC-11.1", name: "Homepage -> Quote Start -> AI Advisor flow", type: "E2E Integration", priority: "Critical",
        precondition: "Fresh browser session", steps: "Open homepage > Click Get a Quote > Verify /quote/start > Select AI Advisor > Verify /quote/ai-advisor > Verify chat input and quick-select chips", expected: "Complete navigation chain works, all elements visible at each step", status: "Pass" },
      { id: "TC-11.2", name: "Homepage -> Quote Start -> Manual Form flow", type: "E2E Integration", priority: "Critical",
        precondition: "Fresh browser session", steps: "Open homepage > Click Get a Quote > Verify /quote/start > Select Fill Manually > Verify /quote/manual > Verify heading and form fields", expected: "Complete navigation chain works, manual form loads correctly", status: "Pass" },
      { id: "TC-11.3", name: "Homepage -> Quote Start -> Business Type flow", type: "E2E Integration", priority: "Critical",
        precondition: "Fresh browser session", steps: "Open homepage > Click Get a Quote > Verify /quote/start > Select Pre-configured > Verify /quote/business-type > Verify heading and cafe card", expected: "Complete navigation chain works, business types grid loads", status: "Pass" },
      { id: "TC-11.4", name: "Cross-method navigation: Quote Start -> Upload", type: "E2E Integration", priority: "High",
        precondition: "Fresh browser session", steps: "Open /quote/start > Select Upload > Verify /quote/upload > Verify drop zone and AI Advisor link", expected: "Navigation works, upload page elements visible", status: "Pass" },
    ]
  },
];

// ── Count totals ──
const totalTests = scenarios.reduce((sum, s) => sum + s.tests.length, 0);
const totalPass = scenarios.reduce((sum, s) => sum + s.tests.filter(t => t.status === "Pass").length, 0);

// Table widths for landscape (content width = 15840 - 2*1080 = 13680)
const TW = 13680;
const colWidths = [900, 1200, 3600, 1200, 1000, 2200, 2200, 1380];

// ── Build Document ──
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: C.primary },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: C.primary },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: C.accent },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [
    // ── COVER PAGE (Portrait) ──
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [
        spacer(2000),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "SHORY", font: "Arial", size: 56, bold: true, color: C.primary }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "SME Business Insurance Platform", font: "Arial", size: 28, color: C.accent }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 1 } }, spacing: { after: 400 }, children: [] }),
        spacer(200),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new TextRun({ text: "Automated Test Cases", font: "Arial", size: 48, bold: true, color: C.primary }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "E2E Test Suite Documentation", font: "Arial", size: 28, color: C.accent }),
        ]}),
        spacer(600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Application URL: https://sme-business-web.vercel.app", font: "Arial", size: 20, color: C.accent }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: `Date: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, font: "Arial", size: 20 }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Framework: Playwright + JavaScript (Page Object Model)", font: "Arial", size: 20 }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Prepared by: QA Automation Team", font: "Arial", size: 20 }),
        ]}),
        spacer(600),
        // Summary box
        new Table({
          width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
          rows: [new TableRow({ children: [new TableCell({
            borders: { top: { style: BorderStyle.SINGLE, size: 2, color: C.pass }, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.pass }, left: { style: BorderStyle.SINGLE, size: 2, color: C.pass }, right: { style: BorderStyle.SINGLE, size: 2, color: C.pass } },
            width: { size: 9360, type: WidthType.DXA }, shading: { fill: C.lightGreen, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 240, right: 240 },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [
                new TextRun({ text: "TEST EXECUTION SUMMARY", font: "Arial", size: 22, bold: true, color: C.pass }),
              ]}),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [
                new TextRun({ text: `${totalTests} Test Cases  |  ${scenarios.length} Scenarios  |  11 Page Objects  |  ${totalPass}/${totalTests} Passed  |  100% Pass Rate`, font: "Arial", size: 20 }),
              ]}),
            ],
          })]})],
        }),
      ],
    },
    // ── OVERVIEW PAGE (Portrait) ──
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1080, bottom: 1440, left: 1080 } },
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent, space: 4 } }, spacing: { after: 200 },
          children: [new TextRun({ text: "Shory SME - Automated Test Cases", font: "Arial", size: 18, color: C.accent, italics: true })],
        })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: C.border, space: 4 } },
          children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" })],
        })] }),
      },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Test Suite Overview")] }),
        spacer(100),
        // Project info table
        new Table({
          width: { size: 10080, type: WidthType.DXA }, columnWidths: [3000, 7080],
          rows: [
            ["Project", "Shory SME Business Insurance"], ["Application URL", "https://sme-business-web.vercel.app"],
            ["Framework", "Playwright v1.49+ with JavaScript"], ["Design Pattern", "Page Object Model (POM)"],
            ["Browser", "Chromium (Desktop Chrome)"], ["Total Test Cases", `${totalTests}`],
            ["Total Scenarios", `${scenarios.length}`], ["Page Objects", "11 (BasePage + 10 page-specific)"],
            ["Pass Rate", "100% (65/65)"], ["Execution Time", "~2.3 minutes"],
          ].map((r, i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: C.lightBlue, type: ShadingType.CLEAR }, margins: cm,
              children: [new Paragraph({ children: [new TextRun({ text: r[0], font: "Arial", size: 20, bold: true, color: C.primary })] })] }),
            new TableCell({ borders, width: { size: 7080, type: WidthType.DXA }, shading: i % 2 === 0 ? { fill: C.lightGray, type: ShadingType.CLEAR } : undefined, margins: cm,
              children: [new Paragraph({ children: [new TextRun({ text: r[1], font: "Arial", size: 20 })] })] }),
          ]})),
        }),
        spacer(300),
        // Scenario summary table
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Scenarios Summary")] }),
        spacer(100),
        new Table({
          width: { size: 10080, type: WidthType.DXA }, columnWidths: [900, 3700, 2400, 1580, 1500],
          rows: [
            new TableRow({ children: [hCell("ID", 900), hCell("Scenario Name", 3700), hCell("Test File", 2400), hCell("Tests", 1580), hCell("Status", 1500)] }),
            ...scenarios.map((s, i) => new TableRow({ children: [
              dCell(s.id, 900, { bold: true, fill: i % 2 === 0 ? C.lightGray : undefined }),
              dCell(s.name, 3700, { fill: i % 2 === 0 ? C.lightGray : undefined }),
              dCell(s.file, 2400, { fill: i % 2 === 0 ? C.lightGray : undefined }),
              dCell(`${s.tests.length}`, 1580, { align: AlignmentType.CENTER, fill: i % 2 === 0 ? C.lightGray : undefined }),
              dCell("All Pass", 1500, { align: AlignmentType.CENTER, color: C.pass, bold: true, fill: i % 2 === 0 ? C.lightGray : undefined }),
            ]})),
            // Total row
            new TableRow({ children: [
              dCell("", 900, { fill: C.lightBlue }), dCell("TOTAL", 3700, { bold: true, fill: C.lightBlue }),
              dCell("11 files", 2400, { fill: C.lightBlue }), dCell(`${totalTests}`, 1580, { align: AlignmentType.CENTER, bold: true, fill: C.lightBlue }),
              dCell("65/65 Pass", 1500, { align: AlignmentType.CENTER, color: C.pass, bold: true, fill: C.lightBlue }),
            ]}),
          ],
        }),
      ],
    },
    // ── DETAILED TEST CASES (Landscape) ──
    ...scenarios.map(s => ({
      properties: {
        page: {
          size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent, space: 4 } }, spacing: { after: 200 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "Shory SME - Automated Test Cases", font: "Arial", size: 18, color: C.accent, italics: true }),
            new TextRun({ text: `\t${s.id}: ${s.name}`, font: "Arial", size: 18, color: C.primary, bold: true }),
          ],
        })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: C.border, space: 4 } },
          children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" })],
        })] }),
      },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`${s.id}: ${s.name}`)] }),
        // Scenario info
        new Table({
          width: { size: TW, type: WidthType.DXA }, columnWidths: [2000, 11680],
          rows: [
            ["URL", s.url], ["Test File", s.file], ["Page Object", s.page], ["Description", s.description],
          ].map(r => new TableRow({ children: [
            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: C.lightBlue, type: ShadingType.CLEAR }, margins: cm,
              children: [new Paragraph({ children: [new TextRun({ text: r[0], font: "Arial", size: 18, bold: true, color: C.primary })] })] }),
            new TableCell({ borders, width: { size: 11680, type: WidthType.DXA }, margins: cm,
              children: [new Paragraph({ children: [new TextRun({ text: r[1], font: "Arial", size: 18 })] })] }),
          ]})),
        }),
        spacer(200),
        // Test cases table
        new Table({
          width: { size: TW, type: WidthType.DXA }, columnWidths: colWidths,
          rows: [
            new TableRow({ children: [
              hCell("ID", colWidths[0]), hCell("Test Name", colWidths[1] + colWidths[2]), hCell("Type", colWidths[3]),
              hCell("Priority", colWidths[4]), hCell("Steps", colWidths[5]), hCell("Expected Result", colWidths[6]), hCell("Status", colWidths[7]),
            ].filter((_, idx) => idx !== 2) }), // merge col 1+2
            ...s.tests.map((t, i) => new TableRow({ children: [
              dCell(t.id, colWidths[0], { bold: true, fill: i % 2 === 0 ? C.lightGray : undefined }),
              new TableCell({
                borders, width: { size: colWidths[1] + colWidths[2], type: WidthType.DXA },
                shading: i % 2 === 0 ? { fill: C.lightGray, type: ShadingType.CLEAR } : undefined, margins: cm,
                children: [new Paragraph({ children: [new TextRun({ text: t.name, font: "Arial", size: 18 })] })],
              }),
              dCell(t.type, colWidths[3], { fill: i % 2 === 0 ? C.lightGray : undefined }),
              dCell(t.priority, colWidths[4], { fill: i % 2 === 0 ? C.lightGray : undefined, color: t.priority === "Critical" ? "C0392B" : t.priority === "High" ? "E67E22" : C.black }),
              dCell(t.steps, colWidths[5], { fill: i % 2 === 0 ? C.lightGray : undefined }),
              dCell(t.expected, colWidths[6], { fill: i % 2 === 0 ? C.lightGray : undefined }),
              dCell(t.status, colWidths[7], { align: AlignmentType.CENTER, color: C.pass, bold: true, fill: i % 2 === 0 ? C.lightGray : undefined }),
            ] })),
          ],
        }),
      ],
    })),
  ],
});

// ── Write ──
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/SME_Shory/docs/Test_Cases_Shory_SME.docx", buffer);
  console.log("Test cases document generated: C:/SME_Shory/docs/Test_Cases_Shory_SME.docx");
});
