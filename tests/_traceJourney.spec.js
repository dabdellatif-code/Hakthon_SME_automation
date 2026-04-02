const { test } = require('@playwright/test');

test('trace pre-configured business type journey', async ({ page }) => {
  test.setTimeout(120000);
  const visited = [];
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) visited.push(frame.url());
  });

  // Step 1 – Homepage → Quote Start
  await page.goto('/');
  await page.getByRole('link', { name: /get a quote/i }).first().click();
  await page.waitForLoadState('domcontentloaded');
  console.log('After Get a quote:', page.url());

  // Step 2 – Select a pre-configured business
  await page.getByRole('link', { name: /pre-configured/i }).click();
  await page.waitForLoadState('domcontentloaded');
  console.log('After pre-configured click:', page.url());

  // Dump business type page
  const bizTypeText = await page.evaluate(() => document.body.innerText);
  console.log('=== BUSINESS TYPE PAGE TEXT ===');
  console.log(bizTypeText.substring(0, 2000));

  // Select Cafe / Restaurant — it's a card (heading inside a clickable div)
  const cafeCard = page.getByRole('heading', { name: /café.*restaurant/i }).locator('..');
  if (await cafeCard.isVisible().catch(() => false)) {
    await cafeCard.click();
  } else {
    // fallback: click on the text directly
    await page.getByText('Café / Restaurant').first().click();
  }
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
  console.log('After cafe click:', page.url());

  const afterTypeText = await page.evaluate(() => document.body.innerText);
  console.log('=== AFTER BUSINESS TYPE SELECT ===');
  console.log(afterTypeText.substring(0, 3000));

  // Fill dropdowns if present
  const firstCombo = page.getByRole('combobox').first();
  if (await firstCombo.isVisible().catch(() => false)) {
    await firstCombo.selectOption('Dubai');
    console.log('Selected Dubai');
    const secondCombo = page.getByRole('combobox').nth(1);
    if (await secondCombo.isVisible().catch(() => false)) {
      await secondCombo.selectOption('UAE only');
      console.log('Selected UAE only');
    }
  }

  // Click primary action buttons step by step
  for (let i = 0; i < 6; i++) {
    const primaryBtn = page.locator('button:not([disabled])').filter({ hasText: /get my quotes|continue|next|see quotes/i }).last();
    const visible = await primaryBtn.isVisible().catch(() => false);
    if (!visible) {
      console.log('No primary button at iteration ' + i + ', URL: ' + page.url());
      break;
    }
    const btnText = await primaryBtn.textContent();
    console.log('Clicking: "' + btnText.trim() + '" at URL: ' + page.url());
    await primaryBtn.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1200);

    const spinner = page.getByText(/finding.*quotes|preparing your quote/i);
    if (await spinner.isVisible().catch(() => false)) {
      await spinner.waitFor({ state: 'hidden', timeout: 30000 });
      await page.waitForTimeout(800);
    }

    console.log('Now at (' + (i + 1) + '):', page.url());
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('=== PAGE TEXT AFTER CLICK ' + (i + 1) + ' ===');
    console.log(pageText.substring(0, 2000));
  }

  console.log('All visited URLs:', visited);
});
