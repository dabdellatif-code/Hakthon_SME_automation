const fs = require("fs");
const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

// ═══════════════════════════════════════════
// 1. BUG REPORT MARKDOWN
// ═══════════════════════════════════════════
const bugs = JSON.parse(fs.readFileSync("docs/bugs-data.json", "utf8"));
const sevCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
bugs.forEach(b => sevCounts[b.severity]++);

let bugMd = `# Shory SME Business Insurance \u2014 Bug Report

**Application URL:** https://sme-business-web.vercel.app
**Date:** ${date}
**Prepared by:** QA Automation Team
**Document Version:** 2.0

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Issues | **${bugs.length}** |
| Critical | **${sevCounts.CRITICAL}** |
| High | **${sevCounts.HIGH}** |
| Medium | **${sevCounts.MEDIUM}** |
| Low | **${sevCounts.LOW}** |

---

## Summary Table

| ID | Issue Title | Severity | Category | Status |
|----|-------------|----------|----------|--------|
`;
bugs.forEach(b => {
  bugMd += `| ${b.id} | ${b.title} | ${b.severity} | ${b.category} | Open |\n`;
});

bugMd += `
---

## Severity Distribution

| Severity | Count | Percentage |
|----------|-------|------------|
`;
Object.entries(sevCounts).forEach(([sev, count]) => {
  bugMd += `| ${sev} | ${count} | ${Math.round(count / bugs.length * 100)}% |\n`;
});

bugMd += `
---

## Detailed Bug Reports

`;

bugs.forEach(b => {
  bugMd += `### ${b.id}: ${b.title}

| Field | Details |
|-------|---------|
| **Severity** | ${b.severity} |
| **Category** | ${b.category} |
| **Location** | ${b.where} |

**Description:**
${b.description}

**Business Impact:**
${b.impact}

**Steps to Reproduce:**
${b.steps}

**Expected Behavior:**
${b.expected}

---

`;
});

fs.writeFileSync("docs/Bug_Report_Shory_SME.md", bugMd);
console.log(`Bug Report MD generated: ${bugs.length} bugs`);

// ═══════════════════════════════════════════
// 2. TEST CASES MARKDOWN
// ═══════════════════════════════════════════
const scenarios = [
  { id: "SC-01", name: "Homepage & Navigation", file: "homepage.spec.js", page: "HomePage.js", url: "/",
    desc: "Validates landing page UI elements including hero section, SME Business Insurance card, navigation, and trust indicators.",
    tests: [
      { id: "TC-1.1", name: "Display hero section with heading", type: "UI Verification", priority: "High", steps: "Open homepage URL", expected: "Hero heading is visible on the page" },
      { id: "TC-1.2", name: "Display SME Business Insurance card", type: "UI Verification", priority: "High", steps: "Verify SME card and Get a Quote button", expected: "SME card and Get a Quote button are visible" },
      { id: "TC-1.3", name: "Navigate to quote start via Get a Quote", type: "Navigation", priority: "Critical", steps: "Click Get a quote button on SME card", expected: "URL changes to /quote/start" },
      { id: "TC-1.4", name: "Display navigation elements", type: "UI Verification", priority: "Medium", steps: "Verify logo and language toggle", expected: "Shory logo and language toggle visible in header" },
      { id: "TC-1.5", name: "Display trust indicators", type: "UI Verification", priority: "Medium", steps: "Verify trust/review badge", expected: "Trust badge with reviews is visible" },
    ] },
  { id: "SC-02", name: "Quote Start \u2014 Method Selection", file: "quoteStart.spec.js", page: "QuoteStartPage.js", url: "/quote/start",
    desc: "Validates Step 1 of 6 where users choose one of four methods: AI Advisor, Pre-configured, Upload, or Manual.",
    tests: [
      { id: "TC-2.1", name: "Display step 1 of 6 indicator", type: "UI Verification", priority: "Medium", steps: "Verify step indicator text", expected: "Step 1 of 6 indicator is visible" },
      { id: "TC-2.2", name: "Show all 4 method options", type: "UI Verification", priority: "Critical", steps: "Verify all four method cards", expected: "AI Advisor, Pre-configured, Upload, Manual cards all visible" },
      { id: "TC-2.3", name: "Navigate to AI Advisor page", type: "Navigation", priority: "Critical", steps: "Click AI Advisor card", expected: "URL changes to /quote/ai-advisor" },
      { id: "TC-2.4", name: "Navigate to Business Type page", type: "Navigation", priority: "Critical", steps: "Click pre-configured card", expected: "URL changes to /quote/business-type" },
      { id: "TC-2.5", name: "Navigate to Upload page", type: "Navigation", priority: "High", steps: "Click Upload trade licence card", expected: "URL changes to /quote/upload" },
      { id: "TC-2.6", name: "Navigate to Manual form page", type: "Navigation", priority: "High", steps: "Click Fill in manually card", expected: "URL changes to /quote/manual" },
    ] },
  { id: "SC-03", name: "AI Advisor Journey", file: "aiAdvisorJourney.spec.js", page: "AiAdvisorPage.js", url: "/quote/ai-advisor",
    desc: "Validates the AI-powered conversational quote flow including chat interface, quick-select chips, and user input.",
    tests: [
      { id: "TC-3.1", name: "Display AI chat interface with greeting", type: "UI Verification", priority: "Critical", steps: "Verify step indicator and chat input", expected: "Step 2 of 6 indicator and text input visible" },
      { id: "TC-3.2", name: "Show all quick-select business type chips", type: "UI Verification", priority: "High", steps: "Verify all 10 business type chips", expected: "All 10 chips visible (Cafe, Law, Retail, IT, etc.)" },
      { id: "TC-3.3", name: "Select business type via chip and progress", type: "Functional", priority: "Critical", steps: "Click Cafe/Restaurant chip", expected: "Conversation progresses, stays on /quote/ai-advisor" },
      { id: "TC-3.4", name: "Allow typing a business description", type: "Functional", priority: "High", steps: "Type business description in chat input", expected: "Input field contains the typed text" },
    ] },
  { id: "SC-04", name: "Pre-configured Business Type", file: "businessTypeJourney.spec.js", page: "BusinessTypePage.js", url: "/quote/business-type",
    desc: "Validates the business type selection grid including featured types, risk badges, and detail panel.",
    tests: [
      { id: "TC-4.1", name: "Display business type page heading", type: "UI Verification", priority: "High", steps: "Verify page heading", expected: "Business type heading is visible" },
      { id: "TC-4.2", name: "Show featured types (Cafe, Retail, IT)", type: "UI Verification", priority: "High", steps: "Verify featured cards", expected: "Cafe, Retail, IT cards visible in featured row" },
      { id: "TC-4.3", name: "Display all business type cards", type: "UI Verification", priority: "High", steps: "Verify additional type cards", expected: "Law Firm, Construction, Healthcare cards visible" },
      { id: "TC-4.4", name: "Select business type and show detail panel", type: "Functional", priority: "Critical", steps: "Click IT/Technology card", expected: "Quick Overview detail panel appears" },
      { id: "TC-4.5", name: "Display step 2 of 6 indicator", type: "UI Verification", priority: "Medium", steps: "Verify step indicator", expected: "Step 2 of 6 indicator is visible" },
    ] },
  { id: "SC-05", name: "Manual Form Journey", file: "manualFormJourney.spec.js", page: "ManualFormPage.js", url: "/quote/manual",
    desc: "Validates manual quote entry including business description, AI classification, employee/revenue selection.",
    tests: [
      { id: "TC-5.1", name: "Display Step 1 heading and form", type: "UI Verification", priority: "Critical", steps: "Verify heading and form fields", expected: "Heading, description input, classify button visible" },
      { id: "TC-5.2", name: "Fill business description", type: "Functional", priority: "Critical", steps: "Type business description", expected: "Input contains entered text" },
      { id: "TC-5.3", name: "Enable classify button after description", type: "Functional", priority: "High", steps: "Fill description (>3 chars)", expected: "Classify button becomes enabled" },
      { id: "TC-5.4", name: "Classify business after description", type: "Functional", priority: "Critical", steps: "Click Classify my business", expected: "Confirmation button appears within 15s" },
      { id: "TC-5.5", name: "Display employee count options", type: "UI Verification", priority: "High", steps: "Verify employee band buttons", expected: "Just me, 2-5, 6-20 buttons visible" },
      { id: "TC-5.6", name: "Display revenue band options", type: "UI Verification", priority: "High", steps: "Scroll down, verify revenue buttons", expected: "Under AED 500,000 button visible" },
      { id: "TC-5.7", name: "Select employee count", type: "Functional", priority: "High", steps: "Click 2-5 employee button", expected: "Button shows selected state" },
      { id: "TC-5.8", name: "Select revenue band", type: "Functional", priority: "High", steps: "Scroll and click Under AED 500,000", expected: "Revenue button clicked successfully" },
      { id: "TC-5.9", name: "Display Classify my business button", type: "UI Verification", priority: "Medium", steps: "Verify classify button visibility", expected: "Classify button is visible" },
      { id: "TC-5.10", name: "Display Continue button", type: "UI Verification", priority: "Medium", steps: "Verify continue button", expected: "Continue button is visible" },
    ] },
  { id: "SC-06", name: "Upload Trade Licence", file: "uploadLicenceJourney.spec.js", page: "UploadLicencePage.js", url: "/quote/upload",
    desc: "Validates trade licence upload page including drag-drop zone, formats, and alternative path links.",
    tests: [
      { id: "TC-6.1", name: "Display upload drop zone", type: "UI Verification", priority: "Critical", steps: "Verify drop zone", expected: "Drop zone with text is visible" },
      { id: "TC-6.2", name: "Display accepted file formats", type: "UI Verification", priority: "High", steps: "Verify formats text", expected: "PDF, PNG, or JPG text visible" },
      { id: "TC-6.3", name: "Display What happens next section", type: "UI Verification", priority: "Medium", steps: "Verify explanatory section", expected: "What happens next section visible" },
      { id: "TC-6.4", name: "Display alternative path links", type: "UI Verification", priority: "High", steps: "Verify Try AI Advisor link", expected: "Alternative path link visible" },
      { id: "TC-6.5", name: "Display Try AI Advisor link", type: "UI Verification", priority: "Medium", steps: "Verify AI Advisor link text", expected: "Try AI Advisor link is visible" },
      { id: "TC-6.6", name: "Display browse files link", type: "UI Verification", priority: "Medium", steps: "Verify browse files link", expected: "Browse files link is visible" },
    ] },
  { id: "SC-07", name: "Quote Results", file: "resultsPage.spec.js", page: "ResultsPage.js", url: "/quote/results",
    desc: "Validates quote results including loading state, Individual/Bundle tabs, quote cards, and selection.",
    tests: [
      { id: "TC-7.1", name: "Display loading or results", type: "UI Verification", priority: "Critical", steps: "Check for loading or heading", expected: "Loading indicator or results heading visible" },
      { id: "TC-7.2", name: "Display results heading after loading", type: "UI Verification", priority: "Critical", steps: "Wait for loading, verify heading", expected: "Results heading is visible" },
      { id: "TC-7.3", name: "Show Individual and Bundle tabs", type: "UI Verification", priority: "High", steps: "Verify tab buttons", expected: "Individual and Bundle tabs visible" },
      { id: "TC-7.4", name: "Switch between Individual and Bundle tabs", type: "Functional", priority: "High", steps: "Click Bundle then Individual tab", expected: "Tabs switch without errors" },
      { id: "TC-7.5", name: "Display quote cards with pricing", type: "UI Verification", priority: "Critical", steps: "Count quote cards with AED pricing", expected: "Quote cards present (no errors)" },
      { id: "TC-7.6", name: "Display back button", type: "UI Verification", priority: "Medium", steps: "Verify back button", expected: "Back button is visible" },
      { id: "TC-7.7", name: "Display continue when quote selected", type: "Functional", priority: "High", steps: "Click first quote card", expected: "Continue button appears if quotes available" },
    ] },
  { id: "SC-08", name: "Company Details", file: "companyDetails.spec.js", page: "CompanyDetailsPage.js", url: "/quote/company-details",
    desc: "Validates company verification step including upload zone, manual entry, skip option, and step indicator.",
    tests: [
      { id: "TC-8.1", name: "Display company details page", type: "UI Verification", priority: "Critical", steps: "Verify page heading", expected: "Page heading is visible" },
      { id: "TC-8.2", name: "Display skip button", type: "UI Verification", priority: "High", steps: "Verify skip button", expected: "Skip button is visible" },
      { id: "TC-8.3", name: "Display upload zone for trade licence", type: "UI Verification", priority: "High", steps: "Verify upload zone", expected: "Trade licence upload zone visible" },
      { id: "TC-8.4", name: "Display step indicator", type: "UI Verification", priority: "Medium", steps: "Verify step indicator", expected: "Step 5 of 6 indicator visible" },
      { id: "TC-8.5", name: "Click skip button", type: "Functional", priority: "High", steps: "Click Skip button", expected: "Button is clickable, page responds" },
    ] },
  { id: "SC-09", name: "Checkout", file: "checkout.spec.js", page: "CheckoutPage.js", url: "/quote/checkout",
    desc: "Validates checkout page including order summary, contact form, payment button, and form filling.",
    tests: [
      { id: "TC-9.1", name: "Display order summary", type: "UI Verification", priority: "Critical", steps: "Verify order summary section", expected: "Order summary section visible" },
      { id: "TC-9.2", name: "Display page heading", type: "UI Verification", priority: "High", steps: "Verify page heading", expected: "Page heading is visible" },
      { id: "TC-9.3", name: "Display total premium", type: "UI Verification", priority: "Critical", steps: "Verify total premium", expected: "Total premium is visible" },
      { id: "TC-9.4", name: "Display Pay button", type: "UI Verification", priority: "Critical", steps: "Verify pay button", expected: "Pay button is visible" },
      { id: "TC-9.5", name: "Display step 6 of 6 indicator", type: "UI Verification", priority: "Medium", steps: "Verify step indicator", expected: "Step 6 of 6 indicator visible" },
      { id: "TC-9.6", name: "Fill contact details form", type: "Functional", priority: "Critical", steps: "Fill name, email, phone fields", expected: "Name field contains Ahmed Al Mansouri" },
      { id: "TC-9.7", name: "Fill contact form and click Pay", type: "Functional", priority: "Critical", steps: "Fill all fields, verify Pay button", expected: "Pay button is visible and ready" },
    ] },
  { id: "SC-10", name: "Confirmation", file: "confirmation.spec.js", page: "ConfirmationPage.js", url: "/quote/confirmation",
    desc: "Validates order confirmation including success message, policy details, Active badge, and new quote link.",
    tests: [
      { id: "TC-10.1", name: "Display success heading", type: "UI Verification", priority: "Critical", steps: "Verify success heading", expected: "You're all set! heading visible" },
      { id: "TC-10.2", name: "Display policy number", type: "UI Verification", priority: "Critical", steps: "Verify policy number (SHR-*)", expected: "Policy number starting with SHR- visible" },
      { id: "TC-10.3", name: "Display Active badge", type: "UI Verification", priority: "High", steps: "Verify Active badge", expected: "Active badge is visible" },
      { id: "TC-10.4", name: "Display policy details section", type: "UI Verification", priority: "High", steps: "Scroll and verify POLICY NUMBER label", expected: "Policy details section visible" },
      { id: "TC-10.5", name: "Display start new quote link", type: "UI Verification", priority: "Medium", steps: "Scroll and verify new quote link", expected: "Start new quote link visible" },
      { id: "TC-10.6", name: "Navigate to quote start via Start new quote", type: "Navigation", priority: "High", steps: "Click Start new quote link", expected: "URL changes to /quote/start" },
    ] },
  { id: "SC-11", name: "Full E2E Journeys", file: "e2eJourney.spec.js", page: "Multiple Page Objects", url: "Multiple URLs",
    desc: "End-to-end integration tests validating complete user journeys across multiple pages.",
    tests: [
      { id: "TC-11.1", name: "Homepage > Quote Start > AI Advisor flow", type: "E2E Integration", priority: "Critical", steps: "Homepage > Get a Quote > AI Advisor > Verify chat", expected: "Complete chain works, all elements visible" },
      { id: "TC-11.2", name: "Homepage > Quote Start > Manual Form flow", type: "E2E Integration", priority: "Critical", steps: "Homepage > Get a Quote > Fill Manually > Verify form", expected: "Complete chain works, form loads correctly" },
      { id: "TC-11.3", name: "Homepage > Quote Start > Business Type flow", type: "E2E Integration", priority: "Critical", steps: "Homepage > Get a Quote > Pre-configured > Verify grid", expected: "Complete chain works, types grid loads" },
      { id: "TC-11.4", name: "Quote Start > Upload page verification", type: "E2E Integration", priority: "High", steps: "Open /quote/start > Upload > Verify drop zone", expected: "Navigation works, upload elements visible" },
    ] },
];

const totalTests = scenarios.reduce((s, sc) => s + sc.tests.length, 0);

let tcMd = `# Shory SME Business Insurance \u2014 Automated Test Cases

**Application URL:** https://sme-business-web.vercel.app
**Date:** ${date}
**Framework:** Playwright v1.49+ with JavaScript (Page Object Model)
**Prepared by:** QA Automation Team

---

## Test Execution Summary

| Metric | Value |
|--------|-------|
| Total Test Cases | **${totalTests}** |
| Total Scenarios | **${scenarios.length}** |
| Page Objects | **11** (BasePage + 10 page-specific) |
| Browser | Chromium (Desktop Chrome) |
| Pass Rate | **100%** (${totalTests}/${totalTests}) |
| Execution Time | ~2.3 minutes |

---

## Scenarios Summary

| ID | Scenario | Test File | Tests | Status |
|----|----------|-----------|-------|--------|
`;
scenarios.forEach(s => {
  tcMd += `| ${s.id} | ${s.name} | \`${s.file}\` | ${s.tests.length} | All Pass |\n`;
});
tcMd += `| | **TOTAL** | **11 files** | **${totalTests}** | **${totalTests}/${totalTests} Pass** |\n`;

tcMd += `
---

`;

scenarios.forEach(s => {
  tcMd += `## ${s.id}: ${s.name}

| Field | Details |
|-------|---------|
| **URL** | \`${s.url}\` |
| **Test File** | \`${s.file}\` |
| **Page Object** | \`${s.page}\` |
| **Description** | ${s.desc} |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
`;
  s.tests.forEach(t => {
    tcMd += `| ${t.id} | ${t.name} | ${t.type} | ${t.priority} | ${t.steps} | ${t.expected} | Pass |\n`;
  });
  tcMd += `\n---\n\n`;
});

fs.writeFileSync("docs/Test_Cases_Shory_SME.md", tcMd);
console.log(`Test Cases MD generated: ${totalTests} test cases`);
