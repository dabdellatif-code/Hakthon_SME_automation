const { test, expect } = require('@playwright/test');
const UploadLicencePage = require('../pages/UploadLicencePage');

test.describe('Upload Trade Licence Journey', () => {
  let uploadPage;

  test.beforeEach(async ({ page }) => {
    uploadPage = new UploadLicencePage(page);
    await uploadPage.open();
  });

  test('should display page heading', async () => {
    await expect(uploadPage.pageHeading).toBeVisible();
  });

  test('should display upload drop zone', async () => {
    await uploadPage.verifyDropZoneVisible();
  });

  test('should display accepted file formats', async () => {
    await expect(uploadPage.acceptedFormatsText).toBeVisible();
  });

  test('should display browse files link', async () => {
    await expect(uploadPage.browseFilesLink).toBeVisible();
  });

  test('should display Back button', async () => {
    await expect(uploadPage.backButton).toBeVisible();
  });
});
