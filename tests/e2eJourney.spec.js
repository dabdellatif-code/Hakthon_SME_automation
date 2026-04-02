const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const QuoteStartPage = require('../pages/QuoteStartPage');
const AiAdvisorPage = require('../pages/AiAdvisorPage');
const ManualFormPage = require('../pages/ManualFormPage');
const UploadLicencePage = require('../pages/UploadLicencePage');

test.describe('End-to-End Journeys', () => {

  test('should navigate from homepage to quote start via Get a quote', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.clickGetAQuote();

    const quoteStartPage = new QuoteStartPage(page);
    await expect(page).toHaveURL(/\/quote\/start/);
    await quoteStartPage.verifyAllOptionsVisible();
  });

  test('should complete journey: Homepage → Quote Start → AI Advisor', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.clickGetAQuote();

    const quoteStartPage = new QuoteStartPage(page);
    await expect(page).toHaveURL(/\/quote\/start/);
    await quoteStartPage.selectAiAdvisor();

    const aiAdvisorPage = new AiAdvisorPage(page);
    await expect(page).toHaveURL(/\/quote\/ai-advisor/);
    await expect(aiAdvisorPage.businessDescriptionInput).toBeVisible();
  });

  test('should complete journey: Homepage → Quote Start → Manual Form', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.clickGetAQuote();

    const quoteStartPage = new QuoteStartPage(page);
    await expect(page).toHaveURL(/\/quote\/start/);
    await quoteStartPage.selectFillManually();

    const manualFormPage = new ManualFormPage(page);
    await expect(page).toHaveURL(/\/quote\/manual/);
    await expect(manualFormPage.pageHeading).toBeVisible();
  });

  test('should complete journey: Homepage → Quote Start → Upload Licence', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.clickGetAQuote();

    const quoteStartPage = new QuoteStartPage(page);
    await expect(page).toHaveURL(/\/quote\/start/);
    await quoteStartPage.selectUploadLicence();

    const uploadPage = new UploadLicencePage(page);
    await expect(page).toHaveURL(/\/quote\/upload/);
    await uploadPage.verifyDropZoneVisible();
  });

  test('should navigate back from upload to quote start using browser back', async ({ page }) => {
    const quoteStartPage = new QuoteStartPage(page);
    await quoteStartPage.open();
    await quoteStartPage.selectUploadLicence();
    await expect(page).toHaveURL(/\/quote\/upload/);

    await page.goBack();
    await expect(page).toHaveURL(/\/quote\/start/);
  });
});
