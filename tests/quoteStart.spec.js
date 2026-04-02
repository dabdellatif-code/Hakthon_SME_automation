const { test, expect } = require('@playwright/test');
const QuoteStartPage = require('../pages/QuoteStartPage');

test.describe('Quote Start Page', () => {
  let quoteStartPage;

  test.beforeEach(async ({ page }) => {
    quoteStartPage = new QuoteStartPage(page);
    await quoteStartPage.open();
  });

  test('should display step 1 of 7 indicator', async () => {
    await expect(quoteStartPage.stepIndicator).toBeVisible();
  });

  test('should show all four method options', async () => {
    await quoteStartPage.verifyAllOptionsVisible();
  });

  test('should navigate to AI Advisor page', async ({ page }) => {
    await quoteStartPage.selectAiAdvisor();
    await expect(page).toHaveURL(/\/quote\/ai-advisor/);
  });

  test('should navigate to manual form page', async ({ page }) => {
    await quoteStartPage.selectFillManually();
    await expect(page).toHaveURL(/\/quote\/manual/);
  });

  test('should navigate to upload page', async ({ page }) => {
    await quoteStartPage.selectUploadLicence();
    await expect(page).toHaveURL(/\/quote\/upload/);
  });
});
