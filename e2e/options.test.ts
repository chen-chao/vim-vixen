import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';
import OptionPage from './lib/OptionPage';

describe("options page", () => {
  let server = new TestServer().receiveContent('/',
    `<!DOCTYPE html><html lang="en"><body style="width:10000px; height:10000px"></body></html>`,
  );
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    await server.start();
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
    await server.stop();
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('saves current config on blur', async () => {
    let page = await OptionPage.open(lanthan);
    let jsonPage = await page.asJSONOptionPage();
    await jsonPage.updateSettings(`{ "blacklist": [ "https://example.com" ] }`);

    let { settings } = await browser.storage.sync.get('settings');
    assert.strictEqual(settings.source, 'json');
    assert.strictEqual(settings.json, '{ "blacklist": [ "https://example.com" ] } ');

    await jsonPage.updateSettings(`invalid json`);

    settings = (await browser.storage.sync.get('settings')).settings;
    assert.strictEqual(settings.source, 'json');
    assert.strictEqual(settings.json, '{ "blacklist": [ "https://example.com" ] } ');

    let message = await jsonPage.getErrorMessage();
    assert.ok(message.startsWith('SyntaxError:'))
  });

  it('updates keymaps without reloading', async () => {
    let optionPage = await OptionPage.open(lanthan);
    let jsonPage = await optionPage.asJSONOptionPage();
    await jsonPage.updateSettings(`{ "keymaps": { "zz": { "type": "scroll.vertically", "count": 10 } } }`);

    await browser.tabs.create({ url: server.url(), active: false });
    await new Promise((resolve) => setTimeout(resolve, 100));
    let handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[1]);

    let page = await Page.currentContext(webdriver);
    await page.sendKeys('zz');

    await eventually(async() => {
      let y = await page.getScrollY();
      assert.strictEqual(y, 640);
    });
  })
});
