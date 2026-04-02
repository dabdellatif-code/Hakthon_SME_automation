const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');

test.describe('Homepage', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('should display homepage with hero section', async () => {
    await expect(homePage.heroHeading).toBeVisible();
  });

  test('should display Personal and Business navigation links', async () => {
    await expect(homePage.personalLink).toBeVisible();
    await expect(homePage.businessLink).toBeVisible();
  });

  test('should display SME Business Insurance section', async () => {
    await expect(homePage.smeBusinessInsuranceCard).toBeVisible();
  });

  test('should navigate to quote start when clicking Get a quote', async ({ page }) => {
    await homePage.clickGetAQuote();
    await expect(page).toHaveURL(/\/quote\/start/);
  });

  test('should display Get started button', async () => {
    await expect(homePage.getStartedButton).toBeVisible();
  });

  test('should display Shory logo in header', async () => {
    await expect(homePage.logo).toBeVisible();
  });
});
