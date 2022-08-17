const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const { clickBySelector, getText } = require('../../lib/commands');
const { chooseRandomSeat, getSeatFromDecimal } = require('../../lib/utils');

Before(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async () => {
  if (this.browser) {
    await this.browser.close();
  }
});

Given('User is on {string} page', async (string) => {
  await this.page.goto(string);
});

When('User clicks button # {int} of calendar', async (int) => {
  await clickBySelector(this.page, `a:nth-child(${int})`);
});

When("User clicks on {int}-st movie seance's time button", async (int) => {
  await clickBySelector(this.page, '.movie-seances__time');
  this.rowAndSeat = [];
});

When('User clicks on chosen {string}', async (string) => {
  await this.page.waitForSelector('.buying__info');
  this.rowAndSeat.push(await chooseRandomSeat(this.page));
});

When('User clicks on {string} button', async (string) => {
  this.rowAndSeat.sort(function (a, b) {
    return parseFloat(a) - parseFloat(b);
  });
  this.expectedRowAndSeat = getSeatFromDecimal(this.rowAndSeat);
  await clickBySelector(this.page, '.acceptin-button');
});

Then('User sees chosen {string}', async (string) => {
  this.actualSeats = await getText(this.page, '.ticket__chairs');
  expect(this.expectedRowAndSeat.join(', ')).equal(this.actualSeats);
});

When('User clicks on button {string}', async (string) => {
  await clickBySelector(this.page, '.acceptin-button');
});

Then('User get {string}', async (string) => {
  this.ticket = await this.page.$eval('h2', (el) => el.textContent);
  expect(this.ticket).equal('Электронный билет');
});
