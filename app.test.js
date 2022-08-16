const { clickBySelector, getText } = require('./lib/commands');
const { chooseRandomSeat, getSeatFromDecimal } = require('./lib/utils');

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('http://qamid.tmweb.ru/client/index.php');
  await page.waitForSelector('h1');
});

afterEach(() => {
  page.close();
});

describe('App tests', () => {
  test('Should buy ticket in 5 days advance', async () => {
    await clickBySelector(page, 'a:nth-child(6)');
    await clickBySelector(page, '.movie-seances__time');
    await page.waitForSelector('.buying__info');

    let rowAndSeat = [];
    rowAndSeat.push(await chooseRandomSeat(page));
    expectedRowAndSeat = getSeatFromDecimal(rowAndSeat);

    await clickBySelector(page, '.acceptin-button');
    const actualSeats = await getText(page, '.ticket__chairs');
    await page.click('.acceptin-button');
    const ticket = await page.$eval('h2', (el) => el.textContent);

    expect(expectedRowAndSeat.join(', ')).toEqual(actualSeats);
    expect(ticket).toEqual('Электронный билет');
  });

  test('Should buy 3 random tickets for tomorrow', async () => {
    await clickBySelector(page, 'a:nth-child(2)');
    await clickBySelector(page, '.movie-seances__time');
    await page.waitForSelector('.buying__info');

    let rowAndSeat = [];
    rowAndSeat.push(await chooseRandomSeat(page));
    rowAndSeat.push(await chooseRandomSeat(page));
    rowAndSeat.push(await chooseRandomSeat(page));

    rowAndSeat.sort(function (a, b) {
      return parseFloat(a) - parseFloat(b);
    });

    expectedRowAndSeat = getSeatFromDecimal(rowAndSeat);
    await clickBySelector(page, '.acceptin-button');

    const actualSeats = await getText(page, '.ticket__chairs');
    await page.click('.acceptin-button');
    const ticket = await page.$eval('h2', (el) => el.textContent);

    expect(expectedRowAndSeat.join(', ')).toEqual(actualSeats);
    expect(ticket).toEqual('Электронный билет');
  });

  test('Should not let buy ticket without choosing a seat', async () => {
    await clickBySelector(page, 'a:nth-child(3)');
    await clickBySelector(page, '.movie-seances__time');
    await page.waitForSelector('.buying__info');

    let isDisabled = await page.$eval('button', (element) =>
      element.getAttribute('disabled')
    );

    expect(isDisabled).toBeTruthy();
  });
});
