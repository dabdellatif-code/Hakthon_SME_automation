const BasePage = require('./BasePage');

class ConfirmationPage extends BasePage {
  constructor(page) {
    super(page);

    // Step indicator
    this.stepIndicator = page.getByText(/Step 7 of 7.*Confirmed/i);

    // Page heading
    this.pageHeading = page.getByRole('heading', { name: /you're all set/i });

    // Policy summary
    this.activeBadge = page.getByText(/\bActive\b/).first();
    this.policyNumber = page.locator('text=/SHR-/').first();
    this.startNewQuoteBtn = page.getByRole('link', { name: /start a new quote/i });
  }

  async isConfirmed() {
    return await this.pageHeading.isVisible().catch(() => false);
  }
}

module.exports = ConfirmationPage;
