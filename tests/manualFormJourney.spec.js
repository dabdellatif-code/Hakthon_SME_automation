const { test, expect } = require('@playwright/test');
const ManualFormPage = require('../pages/ManualFormPage');
const { validBusiness } = require('../helpers/testData');

test.describe('Manual Form Journey', () => {
  let manualFormPage;

  test.beforeEach(async ({ page }) => {
    manualFormPage = new ManualFormPage(page);
    await manualFormPage.open();
  });

  test('should display page heading', async () => {
    await expect(manualFormPage.pageHeading).toBeVisible();
  });

  test('should display business description input and classify button', async () => {
    await manualFormPage.verifyFormFieldsVisible();
  });

  test('should fill business description', async () => {
    await manualFormPage.fillBusinessDescription(validBusiness.description);
    await expect(manualFormPage.businessDescriptionInput).toHaveValue(validBusiness.description);
  });

  test('should display Classify my business button', async () => {
    await expect(manualFormPage.classifyButton).toBeVisible();
  });

  test('should display employee count options', async () => {
    await expect(manualFormPage.justMeButton).toBeVisible();
    await expect(manualFormPage.twoToFiveButton).toBeVisible();
    await expect(manualFormPage.sixToTwentyButton).toBeVisible();
  });
});
