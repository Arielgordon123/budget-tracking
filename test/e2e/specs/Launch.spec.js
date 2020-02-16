import fs from 'fs';
import { SCRAPERS } from 'israeli-bank-scrapers-core';
import { testWithSpectron } from 'vue-cli-plugin-electron-builder';
import Interactions from '../utils/interactions';
import { scrapers } from './../../../src/modules/scrapers';

const screenshotsDir = './screenshots';

jest.setTimeout(200000);

// Remove when https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/625 closed
const skip = process.env.GITHUB_ACTIONS && process.platform === 'win32';

(skip ? describe.skip : describe)('Launch', () => {
  let stopServe;
  let win;
  let client;
  let interactions;

  beforeEach(async () => {
    let app;
    ({ app, stopServe } = await testWithSpectron());

    // Wait for dev server to start
    win = app.browserWindow;
    ({ client } = app);
    interactions = new Interactions(client);
  });

  test('shows the proper application title', async () => {
    // Window was created
    expect(await client.getWindowCount()).toBe(1);
    // It is not minimized
    expect(await win.isMinimized()).toBe(false);
    // Window is visible
    expect(await win.isVisible()).toBe(true);
    // Size is correct
    const { width, height } = await win.getBounds();
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
    // App is loaded properly
    expect(await client.getHTML('#app')).toMatch(/Israeli Bank Scrapers Desktop/);
  });

  test('should be AddScraper per scraper', async () => {
    const addScrapers = await interactions.getAddScrapers();
    expect(addScrapers.length).toEqual(scrapers.length);
  });

  test('Hide AddScraper components by default', async () => {
    const addScrapers = await interactions.getAddScrapers();
    const visiblities = await Promise.all(addScrapers.map((scraper) => scraper.isVisible()));
    expect(visiblities).not.toContain(true);
    expect(visiblities).toContain(false);
  });

  test('Show AddScraper components when clicking on AddScraper', async () => {
    await interactions.getCollapseAddImporter().then((element) => element.click());
    await interactions.waitForAddScrapersVisible();

    const addScrapers = await interactions.getAddScrapers();
    const visiblities = await Promise.all(addScrapers.map((scraper) => scraper.isVisible()));
    expect(visiblities).not.toContain(false);
  });

  afterEach(async () => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    if (global.lastTest.failed) {
      const imgBuffer = await win.capturePage();
      fs.writeFileSync(`${global.lastTest.test.name.trim()}.png`, imgBuffer);
    }
    await stopServe();
  });
});
