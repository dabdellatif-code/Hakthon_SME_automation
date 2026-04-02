const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
} = require("docx");

// ── Color palette ──
const COLORS = {
  primary: "1B3A5C",
  accent: "2E75B6",
  critical: "C0392B",
  high: "E67E22",
  medium: "F39C12",
  low: "27AE60",
  headerBg: "1B3A5C",
  headerText: "FFFFFF",
  lightGray: "F5F6FA",
  border: "D5D8DC",
  black: "000000",
  white: "FFFFFF",
};

// ── Helpers ──
const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: COLORS.headerBg, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text, bold: true, color: COLORS.headerText, font: "Arial", size: 20 })] })],
  });
}

function dataCell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, font: "Arial", size: 20, bold: opts.bold || false, color: opts.color || COLORS.black })],
    })],
  });
}

function severityCell(severity, width) {
  const colorMap = { CRITICAL: COLORS.critical, HIGH: COLORS.high, MEDIUM: COLORS.medium, LOW: COLORS.low };
  const color = colorMap[severity] || COLORS.black;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: severity, bold: true, font: "Arial", size: 20, color })],
    })],
  });
}

function spacer(size = 200) {
  return new Paragraph({ spacing: { after: size }, children: [] });
}

// ── Bug data ──
const bugs = [
  { id: "BUG-001", title: "Pricing Passed via URL Params \u2014 No Server-Side Verification", severity: "CRITICAL", category: "Security / Fraud",
    where: "Quote flow: Results \u2192 Company Details \u2192 Checkout",
    description: "The entire quote configuration (business type, employees, insurer, products) is passed as URL query parameters between pages. A user can edit the URL in the browser address bar to change their business type from a high-risk category (e.g., Construction) to a low-risk one (e.g., IT/Technology), resulting in a lower premium without any server-side recalculation or verification.",
    impact: "Fraudulent policy purchases at incorrect premiums. Direct financial loss to insurer. Undermines the integrity of the entire pricing model.",
    steps: "1. Complete the quote journey to the Results page\n2. Select an insurer and click Continue\n3. In the browser URL bar, change ?type=construction to ?type=it-technology\n4. Observe the checkout page shows a lower premium for the manipulated business type",
    expected: "Server-side pricing verification on each step. Quote ID with signed/encrypted parameters. Reject tampered URLs." },
  { id: "BUG-002", title: "Trade License Verification Can Be Completely Skipped", severity: "CRITICAL", category: "Compliance",
    where: "/quote/company-details \u2014 \"Skip for now\" button",
    description: "The Company Details page provides a \"Skip for now\" button that allows users to bypass ALL company verification. No trade license number, no company name, no expiry date validation is required to proceed to checkout and complete a policy purchase.",
    impact: "Violates UAE Insurance Authority regulations requiring valid trade license for SME policies. Enables insurance purchases by unlicensed or non-existent businesses. Creates liability exposure for the insurer.",
    steps: "1. Navigate through the quote journey to the Company Details page\n2. Click \"Skip for now\" button\n3. Proceed to checkout and complete the purchase\n4. A policy is issued without any company verification",
    expected: "Trade license verification should be mandatory. At minimum, license number and company name should be required fields before proceeding to checkout." },
  { id: "BUG-003", title: "No Expired License Blocking", severity: "HIGH", category: "Compliance",
    where: "/quote/company-details \u2014 License Expiry Date field",
    description: "The company details form accepts any date for the trade license expiry, including dates in the past. There is no validation to ensure the license is currently valid.",
    impact: "Policies may be issued to businesses with expired licenses. Claims could be voided at settlement time, leading to customer disputes and regulatory issues.",
    steps: "1. Navigate to Company Details and choose manual entry\n2. Enter a past date (e.g., 01/01/2020) as the license expiry\n3. Form accepts the date without error\n4. User can proceed to checkout",
    expected: "Validate that license expiry date is in the future. Show error and block progression for expired licenses." },
  { id: "BUG-004", title: "Risk Level Has No Impact on Pricing", severity: "HIGH", category: "Pricing Logic",
    where: "business-types.json \u2192 lib/pricing.ts \u2192 /quote/results",
    description: "Business types have risk categories (low/medium/high) defined in configuration, but the client-side pricing engine generates quotes using mock data that does not factor in risk level. A high-risk Construction company receives the same base pricing as a low-risk IT/Technology firm.",
    impact: "Severe underpricing of high-risk businesses. Overpricing of low-risk businesses leading to lost customers. Actuarial imbalance in the portfolio.",
    steps: "1. Select \"Construction / Contracting\" (high risk) and note the quoted premiums\n2. Start a new quote and select \"IT / Technology\" (low risk) with same employees/revenue\n3. Compare premiums \u2014 they are identical",
    expected: "High-risk businesses should have higher base premiums and potentially different coverage limits." },
  { id: "BUG-005", title: "Employee Count Does Not Scale Liability Coverage", severity: "HIGH", category: "Pricing Logic",
    where: "Manual form / AI Advisor \u2192 Results page",
    description: "Employee count is collected during the quote journey but has no observable effect on liability coverage limits or pricing. A sole freelancer (\"Just me\") receives identical liability coverage options as a company with 100+ employees.",
    impact: "Inadequate coverage for large employers. Workers compensation and employer liability should scale with headcount. Potential claim shortfalls.",
    steps: "1. Complete a quote with \"Just me\" as employee count and note coverage limits\n2. Complete another quote with \"100+\" employees, same business type\n3. Compare \u2014 identical coverage options (1M/2M/5M)",
    expected: "Coverage limits and premiums should scale with employee count. Higher headcount should require higher minimum liability." },
  { id: "BUG-006", title: "Revenue Band Does Not Affect Business Interruption Limits", severity: "HIGH", category: "Pricing Logic",
    where: "Manual form \u2192 Results page",
    description: "The revenue selection form label explicitly states it is \"Used to calculate your Business Interruption and Liability limits.\" However, the results page shows fixed coverage limit options (1M/2M/5M AED) regardless of the selected revenue band.",
    impact: "A business with AED 10M+ annual revenue is offered a maximum 5M AED BI limit \u2014 providing only 6 months of coverage. Misleading form label creates trust issues.",
    steps: "1. Select revenue \"Under AED 500,000\" and note BI coverage limits\n2. Select revenue \"Over AED 10 million\" and note BI coverage limits\n3. Both show identical 1M/2M/5M options",
    expected: "BI limits should be proportional to annual revenue. At minimum, recommended limits should differ." },
  { id: "BUG-007", title: "Emirate vs Coverage Area Mismatch Not Validated", severity: "HIGH", category: "Validation",
    where: "/quote/manual \u2014 Step 2 of 2",
    description: "The manual form Step 2 has separate \"Emirate\" and \"Coverage Area\" dropdown fields. There is no validation that the selected coverage area is within or related to the selected emirate. A user can select Emirate = \"Dubai\" with Coverage Area = \"Abu Dhabi\" without any warning.",
    impact: "Policies may be issued with mismatched geographic coverage, creating ambiguity at claim time. Different emirates have different regulatory requirements.",
    steps: "1. Navigate to Manual form Step 2\n2. Select Emirate: Dubai\n3. Select Coverage Area: Abu Dhabi\n4. No validation error appears",
    expected: "Coverage area should be constrained to the selected emirate, or show a warning for cross-emirate coverage." },
  { id: "BUG-008", title: "All Entry Methods Produce Identical Quotes", severity: "HIGH", category: "Business Logic",
    where: "AI Advisor / Manual / Business Type / Upload \u2192 /quote/results",
    description: "All four entry methods (AI Advisor, Manual Form, Pre-configured Business Type, Upload Trade License) ultimately navigate to the same results page with the same query parameters. There is no difference in the quotes generated regardless of which path the user takes.",
    impact: "The \"AI Advisor (Recommended)\" label is misleading since it provides no additional intelligence or personalization. Users gain no benefit from choosing one method over another. Reduces trust in the AI feature.",
    steps: "1. Complete a quote via AI Advisor for \"IT / Technology\" in Dubai\n2. Complete same quote via Manual form\n3. Compare the results page URLs and displayed quotes\n4. They are identical",
    expected: "AI Advisor should provide personalized coverage recommendations. Pre-configured should offer curated bundles. Each path should add unique value." },
  { id: "BUG-009", title: "Phone Validation Accepts Invalid UAE Numbers", severity: "MEDIUM", category: "Validation",
    where: "/quote/checkout \u2014 Contact form",
    description: "The checkout contact form phone field uses regex 5\\d{8} which accepts 9-digit numbers starting with 5. While correct for the local format after +971, the UI shows no country code prefix, creating confusion about the expected format.",
    impact: "Policy documents and SMS renewal reminders may fail delivery. Customer communication disrupted.",
    steps: "1. Navigate to checkout\n2. Enter phone: 501234567 (9 digits) \u2014 accepted\n3. Enter phone: 0501234567 (10 digits with leading 0) \u2014 may be rejected\n4. No +971 prefix shown in UI",
    expected: "Show +971 country code prefix in the UI. Accept both 05XXXXXXXX (10 digit) and 5XXXXXXXX (9 digit) formats." },
  { id: "BUG-010", title: "No Product Suitability Check", severity: "MEDIUM", category: "Business Logic",
    where: "/quote/results \u2014 Product listing",
    description: "The results page shows ALL available insurance products for any business type without filtering by relevance. A restaurant is offered \"Cyber Insurance\" and \"Professional Indemnity,\" while an IT company is offered \"Equipment Breakdown\" for heavy machinery.",
    impact: "User confusion and decision paralysis. Risk of purchasing irrelevant coverage. Missed opportunity for targeted recommendations.",
    steps: "1. Complete quote for a Cafe/Restaurant\n2. View results \u2014 Cyber Insurance is listed as an option\n3. Complete quote for IT/Technology\n4. View results \u2014 Equipment Breakdown is listed",
    expected: "Products should be filtered or ranked by relevance to the selected business type." },
  { id: "BUG-011", title: "Bundle Discounts Not Transparent", severity: "MEDIUM", category: "UX / Business",
    where: "/quote/results \u2014 Bundle tab",
    description: "The Bundle tab in results shows bundled product packages but does not display the discount percentage or a comparison with individual product pricing. Users cannot determine the value of choosing a bundle.",
    impact: "Users cannot make informed decisions. Reduced bundle adoption rate. Lost revenue opportunity.",
    steps: "1. Navigate to results page\n2. View Individual tab and note prices\n3. Switch to Bundle tab\n4. No savings comparison or discount percentage shown",
    expected: "Show \"Save X%\" badge or \"Individual total: Y AED, Bundle price: Z AED\" comparison." },
  { id: "BUG-012", title: "No Cooling-Off Period Information", severity: "MEDIUM", category: "Compliance",
    where: "/quote/checkout and /quote/confirmation",
    description: "Neither the checkout nor the confirmation page displays any information about the policyholder's right to cancel within the cooling-off period. UAE insurance regulations require disclosure of cancellation rights.",
    impact: "Regulatory non-compliance. Potential fines from UAE Insurance Authority. Customer disputes over cancellation rights.",
    steps: "1. Complete a full purchase journey\n2. Review checkout page \u2014 no cancellation policy mentioned\n3. Review confirmation page \u2014 no cooling-off period notice",
    expected: "Display cooling-off period notice (typically 30 days) on checkout page before payment, and again on confirmation." },
  { id: "BUG-013", title: "Mock OCR \u2014 Upload Path Is Non-Functional", severity: "MEDIUM", category: "Feature Gap",
    where: "/quote/upload \u2192 lib/mock-ocr.ts",
    description: "The Upload Trade License feature uses a mock OCR implementation that returns hardcoded dummy data regardless of the uploaded file. Every upload returns the same fake company details.",
    impact: "Users are given a false sense that their document was analyzed. Creates confusion when displayed data doesn't match their actual license.",
    steps: "1. Upload any file (even a blank PDF)\n2. OCR processing animation plays\n3. Same hardcoded company data is always shown",
    expected: "Integrate real OCR service or clearly label as demo/prototype feature." },
  { id: "BUG-014", title: "AI Advisor Uses Demo Responses", severity: "MEDIUM", category: "Feature Gap",
    where: "/quote/ai-advisor \u2192 lib/ai-demo-responses.ts",
    description: "The AI Advisor feature uses pre-scripted demo responses instead of real Claude API integration. The conversational flow follows a fixed script regardless of user input.",
    impact: "AI classification may not match the user's actual business description. Users receive a scripted experience rather than intelligent recommendations.",
    steps: "1. Open AI Advisor\n2. Type any business description\n3. AI responds with the same scripted flow regardless of input",
    expected: "Integrate real AI classification or clearly label as demo feature." },
  { id: "BUG-015", title: "Step Numbering Gap \u2014 Step 3 Missing", severity: "LOW", category: "UX",
    where: "Progress indicator across all pages",
    description: "The progress indicator shows Steps 1, 2, 4, 5, 6. Step 3 (Coverage selection) appears to be skipped in the user journey.",
    impact: "Users may feel they missed a step or the journey is incomplete.",
    steps: "1. Navigate through the full journey\n2. Observe step indicator: 1, 2 then jumps to 4",
    expected: "Either add Step 3 content or renumber to Steps 1-5." },
  { id: "BUG-016", title: "Personal Tab on Homepage Goes to Dead End", severity: "LOW", category: "UX",
    where: "Homepage \u2014 Personal tab",
    description: "The Personal tab on the homepage shows Car, Health, Home, Pet insurance cards \u2014 all disabled with \"Coming Soon.\" Clicking Personal navigates to a separate Coming Soon page.",
    impact: "Sets false expectations. Users clicking Personal see no value and may leave the site.",
    steps: "1. Visit homepage\n2. Click \"Personal\" tab\n3. All cards show \"Coming Soon\" with no actionable options",
    expected: "Hide the Personal tab or show an inline message instead of a dead-end page." },
  { id: "BUG-017", title: "No Form Data Persistence on Back Navigation", severity: "LOW", category: "UX",
    where: "All quote journey steps",
    description: "Navigating back from one step and then re-entering the next step loses all previously entered form data. Users who want to change their entry method must re-enter everything from scratch.",
    impact: "Poor user experience. Increased drop-off rate. Frustrated users.",
    steps: "1. Fill out Manual form (description, employees, revenue)\n2. Go back to Step 1 (Choose Method)\n3. Re-enter Manual form\n4. All fields are empty",
    expected: "Persist form data in session storage and restore when navigating back." },
  { id: "BUG-018", title: "Download PDF/Invoice Buttons Not Rendering", severity: "LOW", category: "Bug",
    where: "/quote/confirmation",
    description: "The confirmation page source code includes \"Download PDF\" and \"Download Invoice\" buttons, but they do not render on the deployed site. Users cannot download proof of their purchase.",
    impact: "Users have no way to save or print their policy documents. Reduces trust and professionalism.",
    steps: "1. Complete a full purchase journey to the confirmation page\n2. Scroll through the entire page\n3. Download buttons are not visible",
    expected: "Download buttons should render and produce valid PDF documents." },
  { id: "BUG-019", title: "Classify Button Does Not React to Programmatic fill() - React State Bug", severity: "HIGH", category: "Technical / Accessibility",
    where: "/quote/manual - Manual Form Step 1",
    description: "Using Playwright's fill() method to set the business description input does NOT trigger React's state update. The 'Classify my business' button stays disabled even though text is visible in the field. The React component uses an onChange handler that doesn't fire on programmatic fill(). Only pressSequentially() (typing character-by-character) triggers the state properly.",
    impact: "Any form automation, accessibility tool, or password manager that sets values programmatically will fail to enable the button. Breaks WCAG accessibility compliance.",
    steps: "1. Navigate to /quote/manual\n2. Use browser DevTools console: document.querySelector('input').value = 'Test business'\n3. Observe: text appears but Classify button remains disabled\n4. Manually type even one character and observe button enables",
    expected: "Input onChange handler should fire on programmatic value changes. Use input event dispatching or controlled component patterns that respond to value property changes." },
  { id: "BUG-020", title: "Upload Page Alternative Links Do Not Navigate", severity: "HIGH", category: "Navigation / Bug",
    where: "/quote/upload - Try AI Advisor and Enter manually links",
    description: "The 'Try AI Advisor instead' and 'Enter details manually' links are visible on the upload page but clicking them does not trigger navigation. The URL stays on /quote/upload. The links may be using span or div elements with onClick handlers that are not properly wired, or they are Next.js Link components that are not rendering as actual anchor tags.",
    impact: "Users who want to switch from upload to another method are stuck. Reduces the flexibility of the multi-method entry approach.",
    steps: "1. Navigate to /quote/upload\n2. Click 'Try AI Advisor instead' link\n3. Observe: URL remains /quote/upload, no navigation occurs\n4. Click 'Enter details manually' link\n5. Observe: same result, no navigation",
    expected: "Both links should navigate to /quote/ai-advisor and /quote/manual respectively." },
  { id: "BUG-021", title: "Company Details Skip Button Does Not Navigate to Checkout", severity: "HIGH", category: "Navigation / Bug",
    where: "/quote/company-details - Skip for now button",
    description: "Clicking the 'Skip for now' button on the Company Details page does not navigate to /quote/checkout. The page stays on company-details. The skip handler may require certain query parameters like selectedProducts that are not present when navigating with minimal parameters.",
    impact: "Users who want to skip company verification cannot proceed to checkout, breaking the quote journey flow.",
    steps: "1. Navigate to /quote/company-details with basic query params\n2. Click 'Skip for now' button\n3. Observe: page stays on /quote/company-details\n4. URL does not change to /quote/checkout",
    expected: "Skip button should navigate to /quote/checkout with appropriate query parameters carried forward." },
  { id: "BUG-022", title: "Back Button Uses router.back() - Fails Without Browser History", severity: "MEDIUM", category: "Navigation / UX",
    where: "/quote/upload - Back navigation",
    description: "The Back button element on the upload page uses router.back() for navigation instead of an explicit route like /quote/start. When a user navigates directly to the upload page via bookmark, shared link, or direct URL entry, clicking Back navigates to about:blank since there is no browser history.",
    impact: "Users lose their session and see a blank page. Particularly problematic for shared links or bookmarked pages.",
    steps: "1. Open a new browser tab\n2. Navigate directly to /quote/upload\n3. Click the Back button\n4. Observe: browser navigates to about:blank",
    expected: "Back button should use router.push('/quote/start') as a fallback when no browser history exists." },
  { id: "BUG-023", title: "Download PDF and Invoice Buttons Not Rendered on Confirmation Page", severity: "MEDIUM", category: "Feature / Bug",
    where: "/quote/confirmation - Download section",
    description: "The confirmation page source code (confirmation.tsx) includes 'Download PDF' and 'Download Invoice' buttons, but they do not render on the deployed site even after scrolling to the bottom of the page. The buttons may be conditionally rendered based on API response data that is not available when navigating with URL parameters alone.",
    impact: "Users cannot download proof of their insurance purchase. No policy certificate or invoice available for their records.",
    steps: "1. Complete a quote journey or navigate to /quote/confirmation with valid params\n2. Scroll to the bottom of the confirmation page\n3. Observe: no Download PDF or Download Invoice buttons are visible",
    expected: "Download buttons should render and produce valid PDF documents containing policy certificate and payment invoice." },
  { id: "BUG-024", title: "Checkout Contact Form Does Not React to Programmatic fill()", severity: "HIGH", category: "Technical / Accessibility",
    where: "/quote/checkout - Contact details form",
    description: "Similar to the manual form bug, using Playwright's fill() on the checkout contact form inputs (Full Name, Email, Phone) sets the visible value but does not update React internal state. Clicking 'Pay Now' after fill() still triggers validation errors as if fields are empty. Only pressSequentially() (character-by-character typing) correctly updates the component state.",
    impact: "Same accessibility and automation impact as the manual form. Password managers, autofill features, and assistive technologies will fail to properly fill the checkout form.",
    steps: "1. Navigate to /quote/checkout with valid params\n2. Use Playwright fill() to set name, email, phone\n3. Click Pay Now button\n4. Observe: validation errors appear for 'required' fields despite visible values",
    expected: "Form inputs should respond to programmatic value changes and update internal React state accordingly." },
  { id: "BUG-025", title: "Homepage Personal Navigation Goes to Dead-End Coming Soon Page", severity: "LOW", category: "UX",
    where: "/ (Homepage) - Personal navigation tab",
    description: "Clicking the 'Personal' navigation link on the homepage takes users to a 'Coming Soon' page showing disabled cards for Car, Health, Home, and Pet insurance. The page has no useful content and only a 'Back to Home' button to return. This appears as a broken link rather than a planned feature announcement.",
    impact: "Poor user experience. Users clicking Personal see no value and may lose confidence in the platform. The dead-end page increases bounce rate.",
    steps: "1. Navigate to homepage\n2. Click 'Personal' navigation link\n3. Observe: redirected to Coming Soon page with all cards disabled",
    expected: "Either hide the Personal tab entirely, or show an inline 'Coming Soon' message on the homepage without navigating away." },
];

// ── Build Document ──
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: COLORS.primary },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: COLORS.primary },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: COLORS.accent },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u00B7", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    // ── COVER PAGE ──
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        spacer(2000),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "SHORY", font: "Arial", size: 56, bold: true, color: COLORS.primary }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "SME Business Insurance Platform", font: "Arial", size: 28, color: COLORS.accent }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.accent, space: 1 } }, spacing: { after: 400 }, children: [] }),
        spacer(200),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new TextRun({ text: "Bug Report", font: "Arial", size: 48, bold: true, color: COLORS.primary }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Business Logic & Compliance Issues", font: "Arial", size: 28, color: COLORS.accent }),
        ]}),
        spacer(600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Application URL: https://sme-business-web.vercel.app", font: "Arial", size: 20, color: COLORS.accent }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: `Date: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, font: "Arial", size: 20 }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Prepared by: QA Automation Team", font: "Arial", size: 20 }),
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Document Version: 1.0", font: "Arial", size: 20 }),
        ]}),
        spacer(800),
        // Summary box
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({ children: [
            new TableCell({
              borders: { top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.critical }, bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.critical }, left: { style: BorderStyle.SINGLE, size: 2, color: COLORS.critical }, right: { style: BorderStyle.SINGLE, size: 2, color: COLORS.critical } },
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: "FDF2F2", type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 240, right: 240 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [
                  new TextRun({ text: "EXECUTIVE SUMMARY", font: "Arial", size: 22, bold: true, color: COLORS.critical }),
                ]}),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [
                  new TextRun({ text: "25 Issues Found  |  2 Critical  |  8 High  |  8 Medium  |  7 Low", font: "Arial", size: 20 }),
                ]}),
              ],
            }),
          ]})]
        }),
      ],
    },
    // ── SUMMARY TABLE PAGE ──
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1080, bottom: 1440, left: 1080 } },
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.accent, space: 4 } },
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Shory SME \u2014 Bug Report", font: "Arial", size: 18, color: COLORS.accent, italics: true }),
          ],
        })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border, space: 4 } },
          children: [
            new TextRun({ text: "Page ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" }),
          ],
        })] }),
      },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Summary of All Issues")] }),
        spacer(100),
        // Summary table
        new Table({
          width: { size: 10080, type: WidthType.DXA },
          columnWidths: [1100, 4580, 1200, 1600, 1600],
          rows: [
            new TableRow({ children: [
              headerCell("ID", 1100), headerCell("Issue Title", 4580), headerCell("Severity", 1200), headerCell("Category", 1600), headerCell("Status", 1600),
            ]}),
            ...bugs.map((b, i) => new TableRow({ children: [
              dataCell(b.id, 1100, { shading: i % 2 === 0 ? COLORS.lightGray : undefined, bold: true }),
              dataCell(b.title, 4580, { shading: i % 2 === 0 ? COLORS.lightGray : undefined }),
              severityCell(b.severity, 1200),
              dataCell(b.category, 1600, { shading: i % 2 === 0 ? COLORS.lightGray : undefined }),
              dataCell("Open", 1600, { shading: i % 2 === 0 ? COLORS.lightGray : undefined, color: COLORS.critical }),
            ]})),
          ],
        }),
        spacer(300),
        // Severity distribution
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Severity Distribution")] }),
        spacer(100),
        new Table({
          width: { size: 6000, type: WidthType.DXA },
          columnWidths: [2000, 2000, 2000],
          rows: [
            new TableRow({ children: [headerCell("Severity", 2000), headerCell("Count", 2000), headerCell("Percentage", 2000)] }),
            new TableRow({ children: [
              dataCell("CRITICAL", 2000, { color: COLORS.critical, bold: true }), dataCell("2", 2000, { align: AlignmentType.CENTER }), dataCell("8%", 2000, { align: AlignmentType.CENTER }),
            ]}),
            new TableRow({ children: [
              dataCell("HIGH", 2000, { color: COLORS.high, bold: true, shading: COLORS.lightGray }), dataCell("8", 2000, { align: AlignmentType.CENTER, shading: COLORS.lightGray }), dataCell("32%", 2000, { align: AlignmentType.CENTER, shading: COLORS.lightGray }),
            ]}),
            new TableRow({ children: [
              dataCell("MEDIUM", 2000, { color: COLORS.medium, bold: true }), dataCell("8", 2000, { align: AlignmentType.CENTER }), dataCell("32%", 2000, { align: AlignmentType.CENTER }),
            ]}),
            new TableRow({ children: [
              dataCell("LOW", 2000, { color: COLORS.low, bold: true, shading: COLORS.lightGray }), dataCell("7", 2000, { align: AlignmentType.CENTER, shading: COLORS.lightGray }), dataCell("28%", 2000, { align: AlignmentType.CENTER, shading: COLORS.lightGray }),
            ]}),
          ],
        }),
      ],
    },
    // ── DETAILED BUG REPORTS ──
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1080, bottom: 1440, left: 1080 } },
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.accent, space: 4 } },
          spacing: { after: 200 },
          children: [new TextRun({ text: "Shory SME \u2014 Bug Report \u2014 Detailed Findings", font: "Arial", size: 18, color: COLORS.accent, italics: true })],
        })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border, space: 4 } },
          children: [
            new TextRun({ text: "Page ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" }),
          ],
        })] }),
      },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Detailed Bug Reports")] }),
        spacer(100),
        // Generate each bug report
        ...bugs.flatMap((b) => {
          const severityColors = { CRITICAL: COLORS.critical, HIGH: COLORS.high, MEDIUM: COLORS.medium, LOW: COLORS.low };
          const sevColor = severityColors[b.severity] || COLORS.black;
          return [
            // Bug header with ID and severity
            new Table({
              width: { size: 10080, type: WidthType.DXA },
              columnWidths: [7080, 3000],
              rows: [new TableRow({ children: [
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 3, color: sevColor }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.SINGLE, size: 3, color: sevColor }, right: { style: BorderStyle.NONE, size: 0 } },
                  width: { size: 7080, type: WidthType.DXA },
                  margins: { top: 120, bottom: 120, left: 160, right: 80 },
                  children: [new Paragraph({ children: [
                    new TextRun({ text: `${b.id}: `, font: "Arial", size: 24, bold: true, color: sevColor }),
                    new TextRun({ text: b.title, font: "Arial", size: 24, bold: true, color: COLORS.primary }),
                  ]})],
                }),
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 3, color: sevColor }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.SINGLE, size: 3, color: sevColor } },
                  width: { size: 3000, type: WidthType.DXA },
                  shading: { fill: sevColor, type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 80, right: 80 },
                  verticalAlign: "center",
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
                    new TextRun({ text: b.severity, font: "Arial", size: 22, bold: true, color: COLORS.white }),
                  ]})],
                }),
              ]})]
            }),
            // Bug details table
            new Table({
              width: { size: 10080, type: WidthType.DXA },
              columnWidths: [2400, 7680],
              rows: [
                { label: "Category", value: b.category },
                { label: "Location", value: b.where },
                { label: "Description", value: b.description },
                { label: "Business Impact", value: b.impact },
                { label: "Steps to Reproduce", value: b.steps },
                { label: "Expected Behavior", value: b.expected },
              ].map((row, i) => new TableRow({ children: [
                new TableCell({
                  borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border }, left: { style: BorderStyle.SINGLE, size: 3, color: sevColor }, right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border } },
                  width: { size: 2400, type: WidthType.DXA },
                  shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: row.label, font: "Arial", size: 20, bold: true, color: COLORS.primary })] })],
                }),
                new TableCell({
                  borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border }, left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border }, right: { style: BorderStyle.SINGLE, size: 3, color: sevColor } },
                  width: { size: 7680, type: WidthType.DXA },
                  margins: cellMargins,
                  children: row.value.split("\n").map(line => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: line, font: "Arial", size: 20 })] })),
                }),
              ]})),
            }),
            spacer(300),
          ];
        }),
      ],
    },
  ],
});

// ── Write file ──
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/SME_Shory/docs/Bug_Report_Shory_SME.docx", buffer);
  console.log("Bug report generated: C:/SME_Shory/docs/Bug_Report_Shory_SME.docx");
});
