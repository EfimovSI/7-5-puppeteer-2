module.exports = {
  async clickBySelector(page, selector) {
    try {
      await page.waitForSelector(selector, { disabled: false });
      await page.click(selector);
    } catch (error) {
      throw new Error(`Can't click element by selector "${selector}"`);
    }
  },

  async getText(page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (element) => element.textContent);
    } catch (error) {
      throw new Error(`Can't get text from selector "${selector}"`);
    }
  }
};
