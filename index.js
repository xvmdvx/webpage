const fs = require('fs');
const puppeteer = require('puppeteer');

async function run(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (const filing of config.filings) {
    console.log(`Processing ${filing.state} ${filing.type} filing`);
    await page.goto(filing.url, { waitUntil: 'networkidle2' });

    for (const [selector, value] of Object.entries(filing.fields)) {
      await page.waitForSelector(selector);
      await page.type(selector, value);
    }

    if (filing.submitSelector) {
      await page.click(filing.submitSelector);
      await page.waitForTimeout(1000); // allow any navigation
    }
  }

  await browser.close();
}

const configPath = process.argv[2] || 'config.json';
run(configPath).catch(err => {
  console.error(err);
  process.exit(1);
});
