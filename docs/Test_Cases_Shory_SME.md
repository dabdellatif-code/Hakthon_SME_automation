# Shory SME Business Insurance — Automated Test Cases

**Application URL:** https://sme-business-web.vercel.app
**Date:** 03 April 2026
**Framework:** Playwright v1.49+ with JavaScript (Page Object Model)
**Prepared by:** QA Automation Team

---

## Test Execution Summary

| Metric | Value |
|--------|-------|
| Total Test Cases | **65** |
| Total Scenarios | **11** |
| Page Objects | **11** (BasePage + 10 page-specific) |
| Browser | Chromium (Desktop Chrome) |
| Pass Rate | **100%** (65/65) |
| Execution Time | ~2.3 minutes |

---

## Scenarios Summary

| ID | Scenario | Test File | Tests | Status |
|----|----------|-----------|-------|--------|
| SC-01 | Homepage & Navigation | `homepage.spec.js` | 5 | All Pass |
| SC-02 | Quote Start — Method Selection | `quoteStart.spec.js` | 6 | All Pass |
| SC-03 | AI Advisor Journey | `aiAdvisorJourney.spec.js` | 4 | All Pass |
| SC-04 | Pre-configured Business Type | `businessTypeJourney.spec.js` | 5 | All Pass |
| SC-05 | Manual Form Journey | `manualFormJourney.spec.js` | 10 | All Pass |
| SC-06 | Upload Trade Licence | `uploadLicenceJourney.spec.js` | 6 | All Pass |
| SC-07 | Quote Results | `resultsPage.spec.js` | 7 | All Pass |
| SC-08 | Company Details | `companyDetails.spec.js` | 5 | All Pass |
| SC-09 | Checkout | `checkout.spec.js` | 7 | All Pass |
| SC-10 | Confirmation | `confirmation.spec.js` | 6 | All Pass |
| SC-11 | Full E2E Journeys | `e2eJourney.spec.js` | 4 | All Pass |
| | **TOTAL** | **11 files** | **65** | **65/65 Pass** |

---

## SC-01: Homepage & Navigation

| Field | Details |
|-------|---------|
| **URL** | `/` |
| **Test File** | `homepage.spec.js` |
| **Page Object** | `HomePage.js` |
| **Description** | Validates landing page UI elements including hero section, SME Business Insurance card, navigation, and trust indicators. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-1.1 | Display hero section with heading | UI Verification | High | Open homepage URL | Hero heading is visible on the page | Pass |
| TC-1.2 | Display SME Business Insurance card | UI Verification | High | Verify SME card and Get a Quote button | SME card and Get a Quote button are visible | Pass |
| TC-1.3 | Navigate to quote start via Get a Quote | Navigation | Critical | Click Get a quote button on SME card | URL changes to /quote/start | Pass |
| TC-1.4 | Display navigation elements | UI Verification | Medium | Verify logo and language toggle | Shory logo and language toggle visible in header | Pass |
| TC-1.5 | Display trust indicators | UI Verification | Medium | Verify trust/review badge | Trust badge with reviews is visible | Pass |

---

## SC-02: Quote Start — Method Selection

| Field | Details |
|-------|---------|
| **URL** | `/quote/start` |
| **Test File** | `quoteStart.spec.js` |
| **Page Object** | `QuoteStartPage.js` |
| **Description** | Validates Step 1 of 6 where users choose one of four methods: AI Advisor, Pre-configured, Upload, or Manual. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-2.1 | Display step 1 of 6 indicator | UI Verification | Medium | Verify step indicator text | Step 1 of 6 indicator is visible | Pass |
| TC-2.2 | Show all 4 method options | UI Verification | Critical | Verify all four method cards | AI Advisor, Pre-configured, Upload, Manual cards all visible | Pass |
| TC-2.3 | Navigate to AI Advisor page | Navigation | Critical | Click AI Advisor card | URL changes to /quote/ai-advisor | Pass |
| TC-2.4 | Navigate to Business Type page | Navigation | Critical | Click pre-configured card | URL changes to /quote/business-type | Pass |
| TC-2.5 | Navigate to Upload page | Navigation | High | Click Upload trade licence card | URL changes to /quote/upload | Pass |
| TC-2.6 | Navigate to Manual form page | Navigation | High | Click Fill in manually card | URL changes to /quote/manual | Pass |

---

## SC-03: AI Advisor Journey

| Field | Details |
|-------|---------|
| **URL** | `/quote/ai-advisor` |
| **Test File** | `aiAdvisorJourney.spec.js` |
| **Page Object** | `AiAdvisorPage.js` |
| **Description** | Validates the AI-powered conversational quote flow including chat interface, quick-select chips, and user input. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-3.1 | Display AI chat interface with greeting | UI Verification | Critical | Verify step indicator and chat input | Step 2 of 6 indicator and text input visible | Pass |
| TC-3.2 | Show all quick-select business type chips | UI Verification | High | Verify all 10 business type chips | All 10 chips visible (Cafe, Law, Retail, IT, etc.) | Pass |
| TC-3.3 | Select business type via chip and progress | Functional | Critical | Click Cafe/Restaurant chip | Conversation progresses, stays on /quote/ai-advisor | Pass |
| TC-3.4 | Allow typing a business description | Functional | High | Type business description in chat input | Input field contains the typed text | Pass |

---

## SC-04: Pre-configured Business Type

| Field | Details |
|-------|---------|
| **URL** | `/quote/business-type` |
| **Test File** | `businessTypeJourney.spec.js` |
| **Page Object** | `BusinessTypePage.js` |
| **Description** | Validates the business type selection grid including featured types, risk badges, and detail panel. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-4.1 | Display business type page heading | UI Verification | High | Verify page heading | Business type heading is visible | Pass |
| TC-4.2 | Show featured types (Cafe, Retail, IT) | UI Verification | High | Verify featured cards | Cafe, Retail, IT cards visible in featured row | Pass |
| TC-4.3 | Display all business type cards | UI Verification | High | Verify additional type cards | Law Firm, Construction, Healthcare cards visible | Pass |
| TC-4.4 | Select business type and show detail panel | Functional | Critical | Click IT/Technology card | Quick Overview detail panel appears | Pass |
| TC-4.5 | Display step 2 of 6 indicator | UI Verification | Medium | Verify step indicator | Step 2 of 6 indicator is visible | Pass |

---

## SC-05: Manual Form Journey

| Field | Details |
|-------|---------|
| **URL** | `/quote/manual` |
| **Test File** | `manualFormJourney.spec.js` |
| **Page Object** | `ManualFormPage.js` |
| **Description** | Validates manual quote entry including business description, AI classification, employee/revenue selection. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-5.1 | Display Step 1 heading and form | UI Verification | Critical | Verify heading and form fields | Heading, description input, classify button visible | Pass |
| TC-5.2 | Fill business description | Functional | Critical | Type business description | Input contains entered text | Pass |
| TC-5.3 | Enable classify button after description | Functional | High | Fill description (>3 chars) | Classify button becomes enabled | Pass |
| TC-5.4 | Classify business after description | Functional | Critical | Click Classify my business | Confirmation button appears within 15s | Pass |
| TC-5.5 | Display employee count options | UI Verification | High | Verify employee band buttons | Just me, 2-5, 6-20 buttons visible | Pass |
| TC-5.6 | Display revenue band options | UI Verification | High | Scroll down, verify revenue buttons | Under AED 500,000 button visible | Pass |
| TC-5.7 | Select employee count | Functional | High | Click 2-5 employee button | Button shows selected state | Pass |
| TC-5.8 | Select revenue band | Functional | High | Scroll and click Under AED 500,000 | Revenue button clicked successfully | Pass |
| TC-5.9 | Display Classify my business button | UI Verification | Medium | Verify classify button visibility | Classify button is visible | Pass |
| TC-5.10 | Display Continue button | UI Verification | Medium | Verify continue button | Continue button is visible | Pass |

---

## SC-06: Upload Trade Licence

| Field | Details |
|-------|---------|
| **URL** | `/quote/upload` |
| **Test File** | `uploadLicenceJourney.spec.js` |
| **Page Object** | `UploadLicencePage.js` |
| **Description** | Validates trade licence upload page including drag-drop zone, formats, and alternative path links. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-6.1 | Display upload drop zone | UI Verification | Critical | Verify drop zone | Drop zone with text is visible | Pass |
| TC-6.2 | Display accepted file formats | UI Verification | High | Verify formats text | PDF, PNG, or JPG text visible | Pass |
| TC-6.3 | Display What happens next section | UI Verification | Medium | Verify explanatory section | What happens next section visible | Pass |
| TC-6.4 | Display alternative path links | UI Verification | High | Verify Try AI Advisor link | Alternative path link visible | Pass |
| TC-6.5 | Display Try AI Advisor link | UI Verification | Medium | Verify AI Advisor link text | Try AI Advisor link is visible | Pass |
| TC-6.6 | Display browse files link | UI Verification | Medium | Verify browse files link | Browse files link is visible | Pass |

---

## SC-07: Quote Results

| Field | Details |
|-------|---------|
| **URL** | `/quote/results` |
| **Test File** | `resultsPage.spec.js` |
| **Page Object** | `ResultsPage.js` |
| **Description** | Validates quote results including loading state, Individual/Bundle tabs, quote cards, and selection. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-7.1 | Display loading or results | UI Verification | Critical | Check for loading or heading | Loading indicator or results heading visible | Pass |
| TC-7.2 | Display results heading after loading | UI Verification | Critical | Wait for loading, verify heading | Results heading is visible | Pass |
| TC-7.3 | Show Individual and Bundle tabs | UI Verification | High | Verify tab buttons | Individual and Bundle tabs visible | Pass |
| TC-7.4 | Switch between Individual and Bundle tabs | Functional | High | Click Bundle then Individual tab | Tabs switch without errors | Pass |
| TC-7.5 | Display quote cards with pricing | UI Verification | Critical | Count quote cards with AED pricing | Quote cards present (no errors) | Pass |
| TC-7.6 | Display back button | UI Verification | Medium | Verify back button | Back button is visible | Pass |
| TC-7.7 | Display continue when quote selected | Functional | High | Click first quote card | Continue button appears if quotes available | Pass |

---

## SC-08: Company Details

| Field | Details |
|-------|---------|
| **URL** | `/quote/company-details` |
| **Test File** | `companyDetails.spec.js` |
| **Page Object** | `CompanyDetailsPage.js` |
| **Description** | Validates company verification step including upload zone, manual entry, skip option, and step indicator. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-8.1 | Display company details page | UI Verification | Critical | Verify page heading | Page heading is visible | Pass |
| TC-8.2 | Display skip button | UI Verification | High | Verify skip button | Skip button is visible | Pass |
| TC-8.3 | Display upload zone for trade licence | UI Verification | High | Verify upload zone | Trade licence upload zone visible | Pass |
| TC-8.4 | Display step indicator | UI Verification | Medium | Verify step indicator | Step 5 of 6 indicator visible | Pass |
| TC-8.5 | Click skip button | Functional | High | Click Skip button | Button is clickable, page responds | Pass |

---

## SC-09: Checkout

| Field | Details |
|-------|---------|
| **URL** | `/quote/checkout` |
| **Test File** | `checkout.spec.js` |
| **Page Object** | `CheckoutPage.js` |
| **Description** | Validates checkout page including order summary, contact form, payment button, and form filling. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-9.1 | Display order summary | UI Verification | Critical | Verify order summary section | Order summary section visible | Pass |
| TC-9.2 | Display page heading | UI Verification | High | Verify page heading | Page heading is visible | Pass |
| TC-9.3 | Display total premium | UI Verification | Critical | Verify total premium | Total premium is visible | Pass |
| TC-9.4 | Display Pay button | UI Verification | Critical | Verify pay button | Pay button is visible | Pass |
| TC-9.5 | Display step 6 of 6 indicator | UI Verification | Medium | Verify step indicator | Step 6 of 6 indicator visible | Pass |
| TC-9.6 | Fill contact details form | Functional | Critical | Fill name, email, phone fields | Name field contains Ahmed Al Mansouri | Pass |
| TC-9.7 | Fill contact form and click Pay | Functional | Critical | Fill all fields, verify Pay button | Pay button is visible and ready | Pass |

---

## SC-10: Confirmation

| Field | Details |
|-------|---------|
| **URL** | `/quote/confirmation` |
| **Test File** | `confirmation.spec.js` |
| **Page Object** | `ConfirmationPage.js` |
| **Description** | Validates order confirmation including success message, policy details, Active badge, and new quote link. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-10.1 | Display success heading | UI Verification | Critical | Verify success heading | You're all set! heading visible | Pass |
| TC-10.2 | Display policy number | UI Verification | Critical | Verify policy number (SHR-*) | Policy number starting with SHR- visible | Pass |
| TC-10.3 | Display Active badge | UI Verification | High | Verify Active badge | Active badge is visible | Pass |
| TC-10.4 | Display policy details section | UI Verification | High | Scroll and verify POLICY NUMBER label | Policy details section visible | Pass |
| TC-10.5 | Display start new quote link | UI Verification | Medium | Scroll and verify new quote link | Start new quote link visible | Pass |
| TC-10.6 | Navigate to quote start via Start new quote | Navigation | High | Click Start new quote link | URL changes to /quote/start | Pass |

---

## SC-11: Full E2E Journeys

| Field | Details |
|-------|---------|
| **URL** | `Multiple URLs` |
| **Test File** | `e2eJourney.spec.js` |
| **Page Object** | `Multiple Page Objects` |
| **Description** | End-to-end integration tests validating complete user journeys across multiple pages. |

| ID | Test Name | Type | Priority | Steps | Expected Result | Status |
|----|-----------|------|----------|-------|-----------------|--------|
| TC-11.1 | Homepage > Quote Start > AI Advisor flow | E2E Integration | Critical | Homepage > Get a Quote > AI Advisor > Verify chat | Complete chain works, all elements visible | Pass |
| TC-11.2 | Homepage > Quote Start > Manual Form flow | E2E Integration | Critical | Homepage > Get a Quote > Fill Manually > Verify form | Complete chain works, form loads correctly | Pass |
| TC-11.3 | Homepage > Quote Start > Business Type flow | E2E Integration | Critical | Homepage > Get a Quote > Pre-configured > Verify grid | Complete chain works, types grid loads | Pass |
| TC-11.4 | Quote Start > Upload page verification | E2E Integration | High | Open /quote/start > Upload > Verify drop zone | Navigation works, upload elements visible | Pass |

---

