const BasePage = require('./BasePage');

class UploadLicencePage extends BasePage {
  constructor(page) {
    super(page);

    // Step indicator
    this.stepIndicator = page.getByText(/Step 2 of 7/i);

    // Page heading
    this.pageHeading = page.getByRole('heading', { name: /Upload trade licence/i });

    // Upload elements
    this.dropZone = page.getByText(/Drop your trade licence here/i);
    this.browseFilesLink = page.getByText(/browse files/i);
    this.fileInput = page.locator('input[type="file"]');
    this.acceptedFormatsText = page.getByText(/PDF, PNG, or JPG/i);

    // Navigation
    this.backButton = page.getByRole('button', { name: /back/i }).or(page.locator('[class*="back"]')).or(page.getByText(/^.?\s*Back$/i)).first();
  }

  async open() {
    await this.navigateTo('/quote/upload');
  }

  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickBack() {
    await this.backButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyDropZoneVisible() {
    await this.dropZone.waitFor({ state: 'visible' });
  }

  async getStepText() {
    return await this.stepIndicator.textContent();
  }
}

module.exports = UploadLicencePage;
