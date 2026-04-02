const BasePage = require('./BasePage');

class ResultsPage extends BasePage {
  constructor(page) {
    super(page);

    // Loading state
    this.loadingIndicator = page.getByText(/Finding the best quotes/i);
  }

  async open() {
    await this.navigateTo('/quote/results');
  }

  async waitForResultsLoaded(timeout = 30000) {
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout });
  }

  async isLoadingVisible() {
    return await this.loadingIndicator.isVisible();
  }
}

module.exports = ResultsPage;
