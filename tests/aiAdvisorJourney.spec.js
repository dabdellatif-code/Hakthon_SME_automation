const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const QuoteStartPage = require('../pages/QuoteStartPage');
const ManualFormPage = require('../pages/ManualFormPage');
const ResultsPage = require('../pages/ResultsPage');
const CompanyDetailsPage = require('../pages/CompanyDetailsPage');
const CheckoutPage = require('../pages/CheckoutPage');
const ConfirmationPage = require('../pages/ConfirmationPage');
const { validBusiness } = require('../helpers/testData');
const { contactDetails } = require('../helpers/testData');

test.describe('Full Policy Journey – Homepage to Policy Issued', () => {

  test('should complete full journey: Homepage → Quote → Policy confirmation', async ({ page }) => {
    test.setTimeout(120000);

    // ── Step 1: Homepage ─────────────────────────────────────────────────────
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.clickGetAQuote();
    await expect(page).toHaveURL(/\/quote\/start/);

    // ── Step 2: Choose method – Fill in manually ──────────────────────────────
    const quoteStartPage = new QuoteStartPage(page);
    await quoteStartPage.selectFillManually();
    await expect(page).toHaveURL(/\/quote\/manual/);

    // ── Step 3: Business details – Sub-step 1 of 2 ───────────────────────────
    const manualFormPage = new ManualFormPage(page);
    await expect(manualFormPage.pageHeading).toBeVisible();

    // Describe business and let AI classify it
    await manualFormPage.fillBusinessDescription(
      'A small coffee shop in Dubai Marina with 3 employees, serving beverages and pastries'
    );
    await manualFormPage.clickClassify();

    // Wait for classification result then confirm it
    await page.waitForTimeout(2000);
    await manualFormPage.confirmClassificationIfVisible();

    // Select number of employees and annual revenue
    await manualFormPage.selectEmployees('2-5');
    await manualFormPage.selectRevenue('AED 500K – 1 million');
    await manualFormPage.clickContinue();

    // ── Step 4: Business details – Sub-step 2 of 2 (Location & coverage) ─────
    await expect(manualFormPage.subStep2Indicator).toBeVisible();
    await manualFormPage.selectEmirate('Dubai');
    await manualFormPage.selectCoverageArea('UAE only');
    await manualFormPage.clickGetMyQuotes();

    // ── Step 5: Get quotes (results page) ────────────────────────────────────
    await expect(page).toHaveURL(/\/quote\/results/);
    const resultsPage = new ResultsPage(page);

    // Wait for quotes to load (spinner disappears)
    await resultsPage.waitForResultsLoaded(30000);
    await page.waitForTimeout(500);

    // Select the first (cheapest) quote
    const firstSelectBtn = page.getByRole('button', { name: 'Select' }).first();
    await firstSelectBtn.waitFor({ state: 'visible' });
    await firstSelectBtn.click();
    await page.waitForTimeout(800);

    // Proceed via the sticky-footer Continue button
    const continueFooterBtn = page.locator('button').filter({ hasText: 'Continue' }).last();
    await continueFooterBtn.waitFor({ state: 'visible' });
    await continueFooterBtn.click();
    await page.waitForLoadState('domcontentloaded');

    // ── Step 6: Customize – Company details ──────────────────────────────────
    await expect(page).toHaveURL(/\/quote\/company-details/);
    const companyDetailsPage = new CompanyDetailsPage(page);
    await companyDetailsPage.waitForPageReady(20000);
    await expect(companyDetailsPage.pageHeading).toBeVisible();

    // Skip the trade-licence step – fill in later
    await companyDetailsPage.skipDetails();

    // ── Step 7: Purchase – Review & Pay ──────────────────────────────────────
    await expect(page).toHaveURL(/\/quote\/checkout/);
    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.pageHeading).toBeVisible();

    await checkoutPage.fillContactDetails({
      fullName: contactDetails.fullName,
      email: contactDetails.email,
      phone: contactDetails.phone,
    });

    await checkoutPage.clickPayNow();

    // ── Final: Policy issued – Confirmation ───────────────────────────────────
    await expect(page).toHaveURL(/\/quote\/confirmation/);
    const confirmationPage = new ConfirmationPage(page);
    await expect(confirmationPage.pageHeading).toBeVisible();
    await expect(confirmationPage.activeBadge).toBeVisible();
    await expect(confirmationPage.policyNumber).toBeVisible();
  });

});
