# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _traceJourney.spec.js >> trace pre-configured business type journey
- Location: tests\_traceJourney.spec.js:3:1

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByText(/cafe.*restaurant/i).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link "Shory." [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e6]:
          - link "Personal" [ref=e7] [cursor=pointer]:
            - /url: /coming-soon
          - link "Business" [ref=e8] [cursor=pointer]:
            - /url: "#"
          - link "Company" [ref=e9] [cursor=pointer]:
            - /url: "#"
          - link "Help" [ref=e10] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e11]:
        - button "عربي" [ref=e12]:
          - img [ref=e13]
          - text: عربي
        - link "Dashboard" [ref=e18] [cursor=pointer]:
          - /url: http://localhost:3001
          - button "Dashboard" [ref=e19]
  - generic [ref=e22]:
    - generic [ref=e23]:
      - generic [ref=e25]: Step 2 of 7 · What type of business?
      - generic [ref=e26]:
        - 'button "Step 1: Choose method" [ref=e27] [cursor=pointer]'
        - 'button "Step 2: Business details" [disabled] [ref=e28]'
        - 'button "Step 3: Coverage" [disabled] [ref=e29]'
        - 'button "Step 4: Get quotes" [disabled] [ref=e30]'
        - 'button "Step 5: Compare" [disabled] [ref=e31]'
        - 'button "Step 6: Customize" [disabled] [ref=e32]'
        - 'button "Step 7: Purchase" [disabled] [ref=e33]'
      - generic [ref=e34]:
        - generic [ref=e35] [cursor=pointer]: Choose method
        - generic [ref=e36]: Business details
        - generic [ref=e37]: Coverage
        - generic [ref=e38]: Get quotes
        - generic [ref=e39]: Compare
        - generic [ref=e40]: Customize
        - generic [ref=e41]: Purchase
    - generic [ref=e42]:
      - heading "What type of business?" [level=1] [ref=e43]
      - paragraph [ref=e44]: Select your business type to see recommended coverage
    - generic [ref=e45]:
      - generic [ref=e46]:
        - paragraph [ref=e47]: Popular in UAE
        - listbox "Popular business types" [ref=e48]:
          - option "☕ Café / Restaurant Medium risk" [ref=e49]:
            - generic [ref=e51] [cursor=pointer]:
              - generic [ref=e52]: ☕
              - generic [ref=e53]: Café / Restaurant
              - generic [ref=e54]: Medium risk
          - option "🛒 Retail / Trading Medium risk" [ref=e55]:
            - generic [ref=e57] [cursor=pointer]:
              - generic [ref=e58]: 🛒
              - generic [ref=e59]: Retail / Trading
              - generic [ref=e60]: Medium risk
          - option "💻 IT / Technology Low risk" [ref=e61]:
            - generic [ref=e63] [cursor=pointer]:
              - generic [ref=e64]: 💻
              - generic [ref=e65]: IT / Technology
              - generic [ref=e66]: Low risk
      - generic [ref=e69]: all business types
      - listbox "All business types" [ref=e71]:
        - option "⚖️ Law Firm / Legal Medium risk" [ref=e72]:
          - generic [ref=e74] [cursor=pointer]:
            - generic [ref=e75]: ⚖️
            - generic [ref=e76]:
              - generic [ref=e77]: Law Firm / Legal
              - generic [ref=e78]: Medium risk
        - option "🏗️ Construction / Contracting High risk" [ref=e79]:
          - generic [ref=e81] [cursor=pointer]:
            - generic [ref=e82]: 🏗️
            - generic [ref=e83]:
              - generic [ref=e84]: Construction / Contracting
              - generic [ref=e85]: High risk
        - option "🏥 Healthcare / Clinic High risk" [ref=e86]:
          - generic [ref=e88] [cursor=pointer]:
            - generic [ref=e89]: 🏥
            - generic [ref=e90]:
              - generic [ref=e91]: Healthcare / Clinic
              - generic [ref=e92]: High risk
        - option "💼 Consulting / Advisory Medium risk" [ref=e93]:
          - generic [ref=e95] [cursor=pointer]:
            - generic [ref=e96]: 💼
            - generic [ref=e97]:
              - generic [ref=e98]: Consulting / Advisory
              - generic [ref=e99]: Medium risk
        - option "📦 General Trading Medium risk" [ref=e100]:
          - generic [ref=e102] [cursor=pointer]:
            - generic [ref=e103]: 📦
            - generic [ref=e104]:
              - generic [ref=e105]: General Trading
              - generic [ref=e106]: Medium risk
        - option "🚛 Logistics / Transport High risk" [ref=e107]:
          - generic [ref=e109] [cursor=pointer]:
            - generic [ref=e110]: 🚛
            - generic [ref=e111]:
              - generic [ref=e112]: Logistics / Transport
              - generic [ref=e113]: High risk
        - option "🏢 Real Estate Medium risk" [ref=e114]:
          - generic [ref=e116] [cursor=pointer]:
            - generic [ref=e117]: 🏢
            - generic [ref=e118]:
              - generic [ref=e119]: Real Estate
              - generic [ref=e120]: Medium risk
      - button "+ My business type isn't listed Describe your business and we'll classify it for you" [ref=e121] [cursor=pointer]:
        - generic [ref=e122]:
          - generic [ref=e123]: +
          - generic [ref=e124]:
            - generic [ref=e125]: My business type isn't listed
            - generic [ref=e126]: Describe your business and we'll classify it for you
          - img [ref=e127]
  - contentinfo [ref=e129]:
    - generic [ref=e131]:
      - generic [ref=e132]:
        - heading "Personal Insurance" [level=4] [ref=e133]
        - list [ref=e134]:
          - listitem [ref=e135]:
            - link "Car Insurance" [ref=e136] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e137]:
            - link "Non-UAE Vehicles Insurance" [ref=e138] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e139]:
            - link "Health Insurance" [ref=e140] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e141]:
            - link "Home Insurance" [ref=e142] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e143]:
            - link "Pet Insurance" [ref=e144] [cursor=pointer]:
              - /url: "#"
      - generic [ref=e145]:
        - heading "Corporate Insurance" [level=4] [ref=e146]
        - list [ref=e147]:
          - listitem [ref=e148]:
            - link "SME Business Insurance" [ref=e149] [cursor=pointer]:
              - /url: /quote/start
          - listitem [ref=e150]:
            - link "Travel Insurance for Agencies" [ref=e151] [cursor=pointer]:
              - /url: "#"
      - generic [ref=e152]:
        - heading "Company & Help" [level=4] [ref=e153]
        - list [ref=e154]:
          - listitem [ref=e155]:
            - link "Help and Support" [ref=e156] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e157]:
            - link "Blogs" [ref=e158] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e159]:
            - link "Newsroom" [ref=e160] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e161]:
            - link "Sitemap" [ref=e162] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e163]:
            - link "Legal" [ref=e164] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e165]:
            - link "About Us" [ref=e166] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e167]:
            - link "Contact us" [ref=e168] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e169]:
            - generic [ref=e170]: We're Hiring
      - generic [ref=e171]:
        - heading "Download our app" [level=4] [ref=e172]
        - generic [ref=e173]:
          - generic [ref=e174]:
            - paragraph [ref=e175]: Download
            - paragraph [ref=e176]: Shory App
          - generic [ref=e178]: QR
        - generic [ref=e179]:
          - generic [ref=e180]:
            - generic [ref=e181]: 📞
            - generic [ref=e182]: Call us at
          - generic [ref=e183]:
            - paragraph [ref=e184]: "Mon - Sun: 08:00 AM - 10:00 PM"
            - paragraph [ref=e185]: 800 SHORY (74679)
    - generic [ref=e187]:
      - generic [ref=e188]:
        - generic [ref=e189]: Shory.
        - generic [ref=e190]:
          - link "f" [ref=e191] [cursor=pointer]:
            - /url: "#"
          - link "📷" [ref=e192] [cursor=pointer]:
            - /url: "#"
          - link "𝕏" [ref=e193] [cursor=pointer]:
            - /url: "#"
          - link "in" [ref=e194] [cursor=pointer]:
            - /url: "#"
          - link "💬" [ref=e195] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e197]:
        - paragraph [ref=e198]: Licensed and regulated by the UAE Insurance Authority
        - paragraph [ref=e199]: © 2026 All rights reserved.
  - alert [ref=e200]
```

# Test source

```ts
  1  | const { test } = require('@playwright/test');
  2  | 
  3  | test('trace pre-configured business type journey', async ({ page }) => {
  4  |   test.setTimeout(120000);
  5  |   const visited = [];
  6  |   page.on('framenavigated', frame => {
  7  |     if (frame === page.mainFrame()) visited.push(frame.url());
  8  |   });
  9  | 
  10 |   // Step 1 – Homepage → Quote Start
  11 |   await page.goto('/');
  12 |   await page.getByRole('link', { name: /get a quote/i }).first().click();
  13 |   await page.waitForLoadState('domcontentloaded');
  14 |   console.log('After Get a quote:', page.url());
  15 | 
  16 |   // Step 2 – Select a pre-configured business
  17 |   await page.getByRole('link', { name: /pre-configured/i }).click();
  18 |   await page.waitForLoadState('domcontentloaded');
  19 |   console.log('After pre-configured click:', page.url());
  20 | 
  21 |   // Dump business type page
  22 |   const bizTypeText = await page.evaluate(() => document.body.innerText);
  23 |   console.log('=== BUSINESS TYPE PAGE TEXT ===');
  24 |   console.log(bizTypeText.substring(0, 2000));
  25 | 
  26 |   // Select Cafe / Restaurant
  27 |   const cafeLink = page.getByRole('link', { name: /cafe.*restaurant|restaurant/i }).first();
  28 |   if (await cafeLink.isVisible().catch(() => false)) {
  29 |     await cafeLink.click();
  30 |   } else {
> 31 |     await page.getByText(/cafe.*restaurant/i).first().click();
     |                                                       ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  32 |   }
  33 |   await page.waitForLoadState('domcontentloaded');
  34 |   await page.waitForTimeout(1500);
  35 |   console.log('After cafe click:', page.url());
  36 | 
  37 |   const afterTypeText = await page.evaluate(() => document.body.innerText);
  38 |   console.log('=== AFTER BUSINESS TYPE SELECT ===');
  39 |   console.log(afterTypeText.substring(0, 3000));
  40 | 
  41 |   // Fill dropdowns if present
  42 |   const firstCombo = page.getByRole('combobox').first();
  43 |   if (await firstCombo.isVisible().catch(() => false)) {
  44 |     await firstCombo.selectOption('Dubai');
  45 |     console.log('Selected Dubai');
  46 |     const secondCombo = page.getByRole('combobox').nth(1);
  47 |     if (await secondCombo.isVisible().catch(() => false)) {
  48 |       await secondCombo.selectOption('UAE only');
  49 |       console.log('Selected UAE only');
  50 |     }
  51 |   }
  52 | 
  53 |   // Click primary action buttons step by step
  54 |   for (let i = 0; i < 6; i++) {
  55 |     const primaryBtn = page.locator('button:not([disabled])').filter({ hasText: /get my quotes|continue|next|see quotes/i }).last();
  56 |     const visible = await primaryBtn.isVisible().catch(() => false);
  57 |     if (!visible) {
  58 |       console.log('No primary button at iteration ' + i + ', URL: ' + page.url());
  59 |       break;
  60 |     }
  61 |     const btnText = await primaryBtn.textContent();
  62 |     console.log('Clicking: "' + btnText.trim() + '" at URL: ' + page.url());
  63 |     await primaryBtn.click();
  64 |     await page.waitForLoadState('domcontentloaded');
  65 |     await page.waitForTimeout(1200);
  66 | 
  67 |     const spinner = page.getByText(/finding.*quotes|preparing your quote/i);
  68 |     if (await spinner.isVisible().catch(() => false)) {
  69 |       await spinner.waitFor({ state: 'hidden', timeout: 30000 });
  70 |       await page.waitForTimeout(800);
  71 |     }
  72 | 
  73 |     console.log('Now at (' + (i + 1) + '):', page.url());
  74 |     const pageText = await page.evaluate(() => document.body.innerText);
  75 |     console.log('=== PAGE TEXT AFTER CLICK ' + (i + 1) + ' ===');
  76 |     console.log(pageText.substring(0, 2000));
  77 |   }
  78 | 
  79 |   console.log('All visited URLs:', visited);
  80 | });
  81 | 
```