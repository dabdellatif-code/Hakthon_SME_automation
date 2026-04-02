const BasePage = require('./BasePage');

class CompanyDetailsPage extends BasePage {
  constructor(page) {
    super(page);

    // Step indicator
    this.stepIndicator = page.getByText(/Step 6 of 7/i);

    // Page heading
    this.pageHeading = page.getByRole('heading', { name: /company details/i });

    // Options
    this.uploadArea = page.getByText(/drop your trade license/i);
    this.enterManuallyLink = page.getByText(/enter details manually/i);
    this.skipForNowBtn = page.getByRole('button', { name: /skip for now/i });

    // Loading state reused from results
    this.loadingIndicator = page.getByText(/Finding the best quotes/i);
  }

  async waitForPageReady(timeout = 20000) {
    const isLoading = await this.loadingIndicator.isVisible().catch(() => false);
    if (isLoading) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout });
    }
  }

  async skipDetails() {
    await this.skipForNowBtn.waitFor({ state: 'visible' });
    await this.skipForNowBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = CompanyDetailsPage;
