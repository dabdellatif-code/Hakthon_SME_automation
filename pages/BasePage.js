class BasePage {
  constructor(page) {
    this.page = page;

    // Header elements
    this.logo = page.getByRole('link', { name: /shory/i }).first();
    this.navPersonal = page.getByRole('link', { name: /personal/i }).first();
    this.navBusiness = page.getByRole('link', { name: /business/i }).first();
    this.navCompany = page.getByRole('link', { name: /company/i }).first();
    this.navHelp = page.getByRole('link', { name: /help/i }).first();
    this.languageToggle = page.getByRole('link', { name: /عربي/i }).first();
  }

  async navigateTo(path) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async switchToArabic() {
    await this.languageToggle.click();
  }
}

module.exports = BasePage;
