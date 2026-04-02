# Shory SME Business Insurance — Bug Report

**Application URL:** https://sme-business-web.vercel.app
**Date:** 03 April 2026
**Prepared by:** QA Automation Team
**Document Version:** 2.0

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Issues | **25** |
| Critical | **2** |
| High | **10** |
| Medium | **8** |
| Low | **5** |

---

## Summary Table

| ID | Issue Title | Severity | Category | Status |
|----|-------------|----------|----------|--------|
| BUG-001 | Pricing Passed via URL Params — No Server-Side Verification | CRITICAL | Security / Fraud | Open |
| BUG-002 | Trade License Verification Can Be Completely Skipped | CRITICAL | Compliance | Open |
| BUG-003 | No Expired License Blocking | HIGH | Compliance | Open |
| BUG-004 | Risk Level Has No Impact on Pricing | HIGH | Pricing Logic | Open |
| BUG-005 | Employee Count Does Not Scale Liability Coverage | HIGH | Pricing Logic | Open |
| BUG-006 | Revenue Band Does Not Affect Business Interruption Limits | HIGH | Pricing Logic | Open |
| BUG-007 | Emirate vs Coverage Area Mismatch Not Validated | HIGH | Validation | Open |
| BUG-008 | All Entry Methods Produce Identical Quotes | HIGH | Business Logic | Open |
| BUG-009 | Phone Validation Accepts Invalid UAE Numbers | MEDIUM | Validation | Open |
| BUG-010 | No Product Suitability Check | MEDIUM | Business Logic | Open |
| BUG-011 | Bundle Discounts Not Transparent | MEDIUM | UX / Business | Open |
| BUG-012 | No Cooling-Off Period Information | MEDIUM | Compliance | Open |
| BUG-013 | Mock OCR — Upload Path Is Non-Functional | MEDIUM | Feature Gap | Open |
| BUG-014 | AI Advisor Uses Demo Responses | MEDIUM | Feature Gap | Open |
| BUG-015 | Step Numbering Gap — Step 3 Missing | LOW | UX | Open |
| BUG-016 | Personal Tab on Homepage Goes to Dead End | LOW | UX | Open |
| BUG-017 | No Form Data Persistence on Back Navigation | LOW | UX | Open |
| BUG-018 | Download PDF/Invoice Buttons Not Rendering | LOW | Bug | Open |
| BUG-019 | Classify Button Does Not React to Programmatic fill() - React State Bug | HIGH | Technical / Accessibility | Open |
| BUG-020 | Upload Page Alternative Links Do Not Navigate | HIGH | Navigation / Bug | Open |
| BUG-021 | Company Details Skip Button Does Not Navigate to Checkout | HIGH | Navigation / Bug | Open |
| BUG-022 | Back Button Uses router.back() - Fails Without Browser History | MEDIUM | Navigation / UX | Open |
| BUG-023 | Download PDF and Invoice Buttons Not Rendered on Confirmation Page | MEDIUM | Feature / Bug | Open |
| BUG-024 | Checkout Contact Form Does Not React to Programmatic fill() | HIGH | Technical / Accessibility | Open |
| BUG-025 | Homepage Personal Navigation Goes to Dead-End Coming Soon Page | LOW | UX | Open |

---

## Severity Distribution

| Severity | Count | Percentage |
|----------|-------|------------|
| CRITICAL | 2 | 8% |
| HIGH | 10 | 40% |
| MEDIUM | 8 | 32% |
| LOW | 5 | 20% |

---

## Detailed Bug Reports

### BUG-001: Pricing Passed via URL Params — No Server-Side Verification

| Field | Details |
|-------|---------|
| **Severity** | CRITICAL |
| **Category** | Security / Fraud |
| **Location** | Quote flow: Results → Company Details → Checkout |

**Description:**
The entire quote configuration (business type, employees, insurer, products) is passed as URL query parameters between pages. A user can edit the URL in the browser address bar to change their business type from a high-risk category (e.g., Construction) to a low-risk one (e.g., IT/Technology), resulting in a lower premium without any server-side recalculation or verification.

**Business Impact:**
Fraudulent policy purchases at incorrect premiums. Direct financial loss to insurer. Undermines the integrity of the entire pricing model.

**Steps to Reproduce:**
1. Complete the quote journey to the Results page
2. Select an insurer and click Continue
3. In the browser URL bar, change ?type=construction to ?type=it-technology
4. Observe the checkout page shows a lower premium for the manipulated business type

**Expected Behavior:**
Server-side pricing verification on each step. Quote ID with signed/encrypted parameters. Reject tampered URLs.

---

### BUG-002: Trade License Verification Can Be Completely Skipped

| Field | Details |
|-------|---------|
| **Severity** | CRITICAL |
| **Category** | Compliance |
| **Location** | /quote/company-details — "Skip for now" button |

**Description:**
The Company Details page provides a "Skip for now" button that allows users to bypass ALL company verification. No trade license number, no company name, no expiry date validation is required to proceed to checkout and complete a policy purchase.

**Business Impact:**
Violates UAE Insurance Authority regulations requiring valid trade license for SME policies. Enables insurance purchases by unlicensed or non-existent businesses. Creates liability exposure for the insurer.

**Steps to Reproduce:**
1. Navigate through the quote journey to the Company Details page
2. Click "Skip for now" button
3. Proceed to checkout and complete the purchase
4. A policy is issued without any company verification

**Expected Behavior:**
Trade license verification should be mandatory. At minimum, license number and company name should be required fields before proceeding to checkout.

---

### BUG-003: No Expired License Blocking

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Compliance |
| **Location** | /quote/company-details — License Expiry Date field |

**Description:**
The company details form accepts any date for the trade license expiry, including dates in the past. There is no validation to ensure the license is currently valid.

**Business Impact:**
Policies may be issued to businesses with expired licenses. Claims could be voided at settlement time, leading to customer disputes and regulatory issues.

**Steps to Reproduce:**
1. Navigate to Company Details and choose manual entry
2. Enter a past date (e.g., 01/01/2020) as the license expiry
3. Form accepts the date without error
4. User can proceed to checkout

**Expected Behavior:**
Validate that license expiry date is in the future. Show error and block progression for expired licenses.

---

### BUG-004: Risk Level Has No Impact on Pricing

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Pricing Logic |
| **Location** | business-types.json → lib/pricing.ts → /quote/results |

**Description:**
Business types have risk categories (low/medium/high) defined in configuration, but the client-side pricing engine generates quotes using mock data that does not factor in risk level. A high-risk Construction company receives the same base pricing as a low-risk IT/Technology firm.

**Business Impact:**
Severe underpricing of high-risk businesses. Overpricing of low-risk businesses leading to lost customers. Actuarial imbalance in the portfolio.

**Steps to Reproduce:**
1. Select "Construction / Contracting" (high risk) and note the quoted premiums
2. Start a new quote and select "IT / Technology" (low risk) with same employees/revenue
3. Compare premiums — they are identical

**Expected Behavior:**
High-risk businesses should have higher base premiums and potentially different coverage limits.

---

### BUG-005: Employee Count Does Not Scale Liability Coverage

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Pricing Logic |
| **Location** | Manual form / AI Advisor → Results page |

**Description:**
Employee count is collected during the quote journey but has no observable effect on liability coverage limits or pricing. A sole freelancer ("Just me") receives identical liability coverage options as a company with 100+ employees.

**Business Impact:**
Inadequate coverage for large employers. Workers compensation and employer liability should scale with headcount. Potential claim shortfalls.

**Steps to Reproduce:**
1. Complete a quote with "Just me" as employee count and note coverage limits
2. Complete another quote with "100+" employees, same business type
3. Compare — identical coverage options (1M/2M/5M)

**Expected Behavior:**
Coverage limits and premiums should scale with employee count. Higher headcount should require higher minimum liability.

---

### BUG-006: Revenue Band Does Not Affect Business Interruption Limits

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Pricing Logic |
| **Location** | Manual form → Results page |

**Description:**
The revenue selection form label explicitly states it is "Used to calculate your Business Interruption and Liability limits." However, the results page shows fixed coverage limit options (1M/2M/5M AED) regardless of the selected revenue band.

**Business Impact:**
A business with AED 10M+ annual revenue is offered a maximum 5M AED BI limit — providing only 6 months of coverage. Misleading form label creates trust issues.

**Steps to Reproduce:**
1. Select revenue "Under AED 500,000" and note BI coverage limits
2. Select revenue "Over AED 10 million" and note BI coverage limits
3. Both show identical 1M/2M/5M options

**Expected Behavior:**
BI limits should be proportional to annual revenue. At minimum, recommended limits should differ.

---

### BUG-007: Emirate vs Coverage Area Mismatch Not Validated

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Validation |
| **Location** | /quote/manual — Step 2 of 2 |

**Description:**
The manual form Step 2 has separate "Emirate" and "Coverage Area" dropdown fields. There is no validation that the selected coverage area is within or related to the selected emirate. A user can select Emirate = "Dubai" with Coverage Area = "Abu Dhabi" without any warning.

**Business Impact:**
Policies may be issued with mismatched geographic coverage, creating ambiguity at claim time. Different emirates have different regulatory requirements.

**Steps to Reproduce:**
1. Navigate to Manual form Step 2
2. Select Emirate: Dubai
3. Select Coverage Area: Abu Dhabi
4. No validation error appears

**Expected Behavior:**
Coverage area should be constrained to the selected emirate, or show a warning for cross-emirate coverage.

---

### BUG-008: All Entry Methods Produce Identical Quotes

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Business Logic |
| **Location** | AI Advisor / Manual / Business Type / Upload → /quote/results |

**Description:**
All four entry methods (AI Advisor, Manual Form, Pre-configured Business Type, Upload Trade License) ultimately navigate to the same results page with the same query parameters. There is no difference in the quotes generated regardless of which path the user takes.

**Business Impact:**
The "AI Advisor (Recommended)" label is misleading since it provides no additional intelligence or personalization. Users gain no benefit from choosing one method over another. Reduces trust in the AI feature.

**Steps to Reproduce:**
1. Complete a quote via AI Advisor for "IT / Technology" in Dubai
2. Complete same quote via Manual form
3. Compare the results page URLs and displayed quotes
4. They are identical

**Expected Behavior:**
AI Advisor should provide personalized coverage recommendations. Pre-configured should offer curated bundles. Each path should add unique value.

---

### BUG-009: Phone Validation Accepts Invalid UAE Numbers

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | Validation |
| **Location** | /quote/checkout — Contact form |

**Description:**
The checkout contact form phone field uses regex 5\d{8} which accepts 9-digit numbers starting with 5. While correct for the local format after +971, the UI shows no country code prefix, creating confusion about the expected format.

**Business Impact:**
Policy documents and SMS renewal reminders may fail delivery. Customer communication disrupted.

**Steps to Reproduce:**
1. Navigate to checkout
2. Enter phone: 501234567 (9 digits) — accepted
3. Enter phone: 0501234567 (10 digits with leading 0) — may be rejected
4. No +971 prefix shown in UI

**Expected Behavior:**
Show +971 country code prefix in the UI. Accept both 05XXXXXXXX (10 digit) and 5XXXXXXXX (9 digit) formats.

---

### BUG-010: No Product Suitability Check

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | Business Logic |
| **Location** | /quote/results — Product listing |

**Description:**
The results page shows ALL available insurance products for any business type without filtering by relevance. A restaurant is offered "Cyber Insurance" and "Professional Indemnity," while an IT company is offered "Equipment Breakdown" for heavy machinery.

**Business Impact:**
User confusion and decision paralysis. Risk of purchasing irrelevant coverage. Missed opportunity for targeted recommendations.

**Steps to Reproduce:**
1. Complete quote for a Cafe/Restaurant
2. View results — Cyber Insurance is listed as an option
3. Complete quote for IT/Technology
4. View results — Equipment Breakdown is listed

**Expected Behavior:**
Products should be filtered or ranked by relevance to the selected business type.

---

### BUG-011: Bundle Discounts Not Transparent

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | UX / Business |
| **Location** | /quote/results — Bundle tab |

**Description:**
The Bundle tab in results shows bundled product packages but does not display the discount percentage or a comparison with individual product pricing. Users cannot determine the value of choosing a bundle.

**Business Impact:**
Users cannot make informed decisions. Reduced bundle adoption rate. Lost revenue opportunity.

**Steps to Reproduce:**
1. Navigate to results page
2. View Individual tab and note prices
3. Switch to Bundle tab
4. No savings comparison or discount percentage shown

**Expected Behavior:**
Show "Save X%" badge or "Individual total: Y AED, Bundle price: Z AED" comparison.

---

### BUG-012: No Cooling-Off Period Information

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | Compliance |
| **Location** | /quote/checkout and /quote/confirmation |

**Description:**
Neither the checkout nor the confirmation page displays any information about the policyholder's right to cancel within the cooling-off period. UAE insurance regulations require disclosure of cancellation rights.

**Business Impact:**
Regulatory non-compliance. Potential fines from UAE Insurance Authority. Customer disputes over cancellation rights.

**Steps to Reproduce:**
1. Complete a full purchase journey
2. Review checkout page — no cancellation policy mentioned
3. Review confirmation page — no cooling-off period notice

**Expected Behavior:**
Display cooling-off period notice (typically 30 days) on checkout page before payment, and again on confirmation.

---

### BUG-013: Mock OCR — Upload Path Is Non-Functional

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | Feature Gap |
| **Location** | /quote/upload → lib/mock-ocr.ts |

**Description:**
The Upload Trade License feature uses a mock OCR implementation that returns hardcoded dummy data regardless of the uploaded file. Every upload returns the same fake company details.

**Business Impact:**
Users are given a false sense that their document was analyzed. Creates confusion when displayed data doesn't match their actual license.

**Steps to Reproduce:**
1. Upload any file (even a blank PDF)
2. OCR processing animation plays
3. Same hardcoded company data is always shown

**Expected Behavior:**
Integrate real OCR service or clearly label as demo/prototype feature.

---

### BUG-014: AI Advisor Uses Demo Responses

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | Feature Gap |
| **Location** | /quote/ai-advisor → lib/ai-demo-responses.ts |

**Description:**
The AI Advisor feature uses pre-scripted demo responses instead of real Claude API integration. The conversational flow follows a fixed script regardless of user input.

**Business Impact:**
AI classification may not match the user's actual business description. Users receive a scripted experience rather than intelligent recommendations.

**Steps to Reproduce:**
1. Open AI Advisor
2. Type any business description
3. AI responds with the same scripted flow regardless of input

**Expected Behavior:**
Integrate real AI classification or clearly label as demo feature.

---

### BUG-015: Step Numbering Gap — Step 3 Missing

| Field | Details |
|-------|---------|
| **Severity** | LOW |
| **Category** | UX |
| **Location** | Progress indicator across all pages |

**Description:**
The progress indicator shows Steps 1, 2, 4, 5, 6. Step 3 (Coverage selection) appears to be skipped in the user journey.

**Business Impact:**
Users may feel they missed a step or the journey is incomplete.

**Steps to Reproduce:**
1. Navigate through the full journey
2. Observe step indicator: 1, 2 then jumps to 4

**Expected Behavior:**
Either add Step 3 content or renumber to Steps 1-5.

---

### BUG-016: Personal Tab on Homepage Goes to Dead End

| Field | Details |
|-------|---------|
| **Severity** | LOW |
| **Category** | UX |
| **Location** | Homepage — Personal tab |

**Description:**
The Personal tab on the homepage shows Car, Health, Home, Pet insurance cards — all disabled with "Coming Soon." Clicking Personal navigates to a separate Coming Soon page.

**Business Impact:**
Sets false expectations. Users clicking Personal see no value and may leave the site.

**Steps to Reproduce:**
1. Visit homepage
2. Click "Personal" tab
3. All cards show "Coming Soon" with no actionable options

**Expected Behavior:**
Hide the Personal tab or show an inline message instead of a dead-end page.

---

### BUG-017: No Form Data Persistence on Back Navigation

| Field | Details |
|-------|---------|
| **Severity** | LOW |
| **Category** | UX |
| **Location** | All quote journey steps |

**Description:**
Navigating back from one step and then re-entering the next step loses all previously entered form data. Users who want to change their entry method must re-enter everything from scratch.

**Business Impact:**
Poor user experience. Increased drop-off rate. Frustrated users.

**Steps to Reproduce:**
1. Fill out Manual form (description, employees, revenue)
2. Go back to Step 1 (Choose Method)
3. Re-enter Manual form
4. All fields are empty

**Expected Behavior:**
Persist form data in session storage and restore when navigating back.

---

### BUG-018: Download PDF/Invoice Buttons Not Rendering

| Field | Details |
|-------|---------|
| **Severity** | LOW |
| **Category** | Bug |
| **Location** | /quote/confirmation |

**Description:**
The confirmation page source code includes "Download PDF" and "Download Invoice" buttons, but they do not render on the deployed site. Users cannot download proof of their purchase.

**Business Impact:**
Users have no way to save or print their policy documents. Reduces trust and professionalism.

**Steps to Reproduce:**
1. Complete a full purchase journey to the confirmation page
2. Scroll through the entire page
3. Download buttons are not visible

**Expected Behavior:**
Download buttons should render and produce valid PDF documents.

---

### BUG-019: Classify Button Does Not React to Programmatic fill() - React State Bug

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Technical / Accessibility |
| **Location** | /quote/manual - Manual Form Step 1 |

**Description:**
Using Playwright's fill() method to set the business description input does NOT trigger React's state update. The 'Classify my business' button stays disabled even though text is visible in the field. The React component uses an onChange handler that doesn't fire on programmatic fill(). Only pressSequentially() (typing character-by-character) triggers the state properly.

**Business Impact:**
Any form automation, accessibility tool, or password manager that sets values programmatically will fail to enable the button. Breaks WCAG accessibility compliance.

**Steps to Reproduce:**
1. Navigate to /quote/manual
2. Use browser DevTools console: document.querySelector('input').value = 'Test business'
3. Observe: text appears but Classify button remains disabled
4. Manually type even one character and observe button enables

**Expected Behavior:**
Input onChange handler should fire on programmatic value changes. Use input event dispatching or controlled component patterns that respond to value property changes.

---

### BUG-020: Upload Page Alternative Links Do Not Navigate

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Navigation / Bug |
| **Location** | /quote/upload - Try AI Advisor and Enter manually links |

**Description:**
The 'Try AI Advisor instead' and 'Enter details manually' links are visible on the upload page but clicking them does not trigger navigation. The URL stays on /quote/upload. The links may be using span or div elements with onClick handlers that are not properly wired, or they are Next.js Link components that are not rendering as actual anchor tags.

**Business Impact:**
Users who want to switch from upload to another method are stuck. Reduces the flexibility of the multi-method entry approach.

**Steps to Reproduce:**
1. Navigate to /quote/upload
2. Click 'Try AI Advisor instead' link
3. Observe: URL remains /quote/upload, no navigation occurs
4. Click 'Enter details manually' link
5. Observe: same result, no navigation

**Expected Behavior:**
Both links should navigate to /quote/ai-advisor and /quote/manual respectively.

---

### BUG-021: Company Details Skip Button Does Not Navigate to Checkout

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Navigation / Bug |
| **Location** | /quote/company-details - Skip for now button |

**Description:**
Clicking the 'Skip for now' button on the Company Details page does not navigate to /quote/checkout. The page stays on company-details. The skip handler may require certain query parameters like selectedProducts that are not present when navigating with minimal parameters.

**Business Impact:**
Users who want to skip company verification cannot proceed to checkout, breaking the quote journey flow.

**Steps to Reproduce:**
1. Navigate to /quote/company-details with basic query params
2. Click 'Skip for now' button
3. Observe: page stays on /quote/company-details
4. URL does not change to /quote/checkout

**Expected Behavior:**
Skip button should navigate to /quote/checkout with appropriate query parameters carried forward.

---

### BUG-022: Back Button Uses router.back() - Fails Without Browser History

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | Navigation / UX |
| **Location** | /quote/upload - Back navigation |

**Description:**
The Back button element on the upload page uses router.back() for navigation instead of an explicit route like /quote/start. When a user navigates directly to the upload page via bookmark, shared link, or direct URL entry, clicking Back navigates to about:blank since there is no browser history.

**Business Impact:**
Users lose their session and see a blank page. Particularly problematic for shared links or bookmarked pages.

**Steps to Reproduce:**
1. Open a new browser tab
2. Navigate directly to /quote/upload
3. Click the Back button
4. Observe: browser navigates to about:blank

**Expected Behavior:**
Back button should use router.push('/quote/start') as a fallback when no browser history exists.

---

### BUG-023: Download PDF and Invoice Buttons Not Rendered on Confirmation Page

| Field | Details |
|-------|---------|
| **Severity** | MEDIUM |
| **Category** | Feature / Bug |
| **Location** | /quote/confirmation - Download section |

**Description:**
The confirmation page source code (confirmation.tsx) includes 'Download PDF' and 'Download Invoice' buttons, but they do not render on the deployed site even after scrolling to the bottom of the page. The buttons may be conditionally rendered based on API response data that is not available when navigating with URL parameters alone.

**Business Impact:**
Users cannot download proof of their insurance purchase. No policy certificate or invoice available for their records.

**Steps to Reproduce:**
1. Complete a quote journey or navigate to /quote/confirmation with valid params
2. Scroll to the bottom of the confirmation page
3. Observe: no Download PDF or Download Invoice buttons are visible

**Expected Behavior:**
Download buttons should render and produce valid PDF documents containing policy certificate and payment invoice.

---

### BUG-024: Checkout Contact Form Does Not React to Programmatic fill()

| Field | Details |
|-------|---------|
| **Severity** | HIGH |
| **Category** | Technical / Accessibility |
| **Location** | /quote/checkout - Contact details form |

**Description:**
Similar to the manual form bug, using Playwright's fill() on the checkout contact form inputs (Full Name, Email, Phone) sets the visible value but does not update React internal state. Clicking 'Pay Now' after fill() still triggers validation errors as if fields are empty. Only pressSequentially() (character-by-character typing) correctly updates the component state.

**Business Impact:**
Same accessibility and automation impact as the manual form. Password managers, autofill features, and assistive technologies will fail to properly fill the checkout form.

**Steps to Reproduce:**
1. Navigate to /quote/checkout with valid params
2. Use Playwright fill() to set name, email, phone
3. Click Pay Now button
4. Observe: validation errors appear for 'required' fields despite visible values

**Expected Behavior:**
Form inputs should respond to programmatic value changes and update internal React state accordingly.

---

### BUG-025: Homepage Personal Navigation Goes to Dead-End Coming Soon Page

| Field | Details |
|-------|---------|
| **Severity** | LOW |
| **Category** | UX |
| **Location** | / (Homepage) - Personal navigation tab |

**Description:**
Clicking the 'Personal' navigation link on the homepage takes users to a 'Coming Soon' page showing disabled cards for Car, Health, Home, and Pet insurance. The page has no useful content and only a 'Back to Home' button to return. This appears as a broken link rather than a planned feature announcement.

**Business Impact:**
Poor user experience. Users clicking Personal see no value and may lose confidence in the platform. The dead-end page increases bounce rate.

**Steps to Reproduce:**
1. Navigate to homepage
2. Click 'Personal' navigation link
3. Observe: redirected to Coming Soon page with all cards disabled

**Expected Behavior:**
Either hide the Personal tab entirely, or show an inline 'Coming Soon' message on the homepage without navigating away.

---

