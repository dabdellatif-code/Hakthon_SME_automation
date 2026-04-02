const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    // Step indicator
    this.stepIndicator = page.getByText(/Step 7 of 7.*Purchase/i);

    // Page heading
    this.pageHeading = page.getByRole('heading', { name: /review.*pay/i });

    // Contact detail inputs – scoped to the contact section
    this.fullNameInput = page.locator('input[type="text"]').first();
    this.emailInput = page.locator('input[type="email"]').first();
    this.phoneInput = page.locator('input[type="tel"]').first();

    // Submit button
    this.payNowButton = page.getByRole('button', { name: /pay now/i });
  }

  async fillContactDetails({ fullName, email, phone }) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async clickPayNow() {
    await this.payNowButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = CheckoutPage;
