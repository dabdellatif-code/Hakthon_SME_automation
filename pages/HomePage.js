const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section elements
    this.heroHeading = page.getByRole('heading', { name: /top insurers/i }).first();

    // Navigation links
    this.personalLink = page.getByRole('link', { name: /personal/i }).first();
    this.businessLink = page.getByRole('link', { name: /business/i }).first();

    // CTA buttons
    this.getStartedButton = page.getByRole('link', { name: /get started/i }).first();
    this.getAQuoteButton = page.getByRole('link', { name: /get a quote/i }).first();

    // SME Business Insurance section
    this.smeBusinessInsuranceCard = page.getByText(/SME Business Insurance/i).first();
  }

  async open() {
    await this.navigateTo('/');
  }

  async clickBusinessLink() {
    await this.businessLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickPersonalLink() {
    await this.personalLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickGetAQuote() {
    await this.getAQuoteButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isHeroVisible() {
    return await this.heroHeading.isVisible();
  }
}

module.exports = HomePage;
