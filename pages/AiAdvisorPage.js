const BasePage = require('./BasePage');

class AiAdvisorPage extends BasePage {
  constructor(page) {
    super(page);

    // Step indicator
    this.stepIndicator = page.getByText(/Step 2 of 7/i);

    // Chat input
    this.businessDescriptionInput = page.getByRole('textbox').first();

    // Quick-select business type buttons
    this.cafeButton = page.getByRole('button', { name: /Caf[eé].*Restaurant/i });
    this.lawFirmButton = page.getByRole('button', { name: /Law Firm.*Legal/i });
    this.retailButton = page.getByRole('button', { name: /Retail.*Trading/i });
    this.itButton = page.getByRole('button', { name: /IT.*Technology/i });
    this.constructionButton = page.getByRole('button', { name: /Construction.*Contracting/i });
    this.healthcareButton = page.getByRole('button', { name: /Healthcare.*Clinic/i });
    this.consultingButton = page.getByRole('button', { name: /Consulting.*Advisory/i });
    this.generalTradingButton = page.getByRole('button', { name: /General Trading/i });
    this.logisticsButton = page.getByRole('button', { name: /Logistics.*Transport/i });
    this.realEstateButton = page.getByRole('button', { name: /Real Estate/i });

    // Map of business types to their button locators
    this.quickSelectButtons = {
      'cafe': this.cafeButton,
      'law': this.lawFirmButton,
      'retail': this.retailButton,
      'it': this.itButton,
      'construction': this.constructionButton,
      'healthcare': this.healthcareButton,
      'consulting': this.consultingButton,
      'general': this.generalTradingButton,
      'logistics': this.logisticsButton,
      'realestate': this.realEstateButton,
    };
  }

  async open() {
    await this.navigateTo('/quote/ai-advisor');
  }

  async describeBusinessByText(description) {
    await this.businessDescriptionInput.fill(description);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectQuickBusinessType(type) {
    const button = this.quickSelectButtons[type.toLowerCase()];
    if (button) {
      await button.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async verifyAllQuickSelectVisible() {
    for (const button of Object.values(this.quickSelectButtons)) {
      await button.waitFor({ state: 'visible' });
    }
  }

  async getStepText() {
    return await this.stepIndicator.textContent();
  }
}

module.exports = AiAdvisorPage;
