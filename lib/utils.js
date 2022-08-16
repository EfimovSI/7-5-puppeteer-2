const { clickBySelector } = require('./commands');

async function getRandomRowParameters(page, rows) {
  const row = Math.ceil(Math.random() * rows.length);
  const seatsTaken = page.$$(
    `.buying-scheme__row:nth-child(${row}) .buying-scheme__chair_taken`
  );
  return {
    row,
    seatsTaken
  };
}

async function getRandomSeatParameters(page, seats, row) {
  const seat = Math.ceil(Math.random() * seats.length);
  // Через await (await element.getProperty("class")).jsonValue(); не вышло.
  // Вытянуть класс получилось таким способом:
  const list = await page.$$(`div:nth-child(${row}) > span:nth-child(${seat})`);
  let classValueList = await list[0].getProperty('classList');
  let classValue = await classValueList.jsonValue();
  return {
    seat,
    classValue
  };
}

module.exports = {
  async chooseRandomSeat(page) {
    const rowsInHall = await page.$$('.buying-scheme__row');
    const seatsInRow = await page.$$(
      '.buying-scheme__row:nth-child(1) .buying-scheme__chair'
    );
    // Выбор рандомного ряда:
    let randomRowParameters = await getRandomRowParameters(page, rowsInHall);
    // Проверка, что не все места в ряду заняты:
    while (randomRowParameters.seatsTaken.length === seatsInRow.length) {
      randomRowParameters = getRandomRowParameters(page, rowsInHall);
    }
    // Выбор рандомного места в ряду:
    let randomSeatParameters = await getRandomSeatParameters(
      page,
      rowsInHall,
      randomRowParameters.row
    );
    // let seat = Math.ceil(Math.random() * seatsInRow.length);

    // Проверка, что место не забронировано и не выбрано:
    while (randomSeatParameters.classValue[2]) {
      randomSeatParameters = await getRandomSeatParameters(
        page,
        rowsInHall,
        randomRowParameters.row
      );
    }
    // Форматирование места для сортировки:
    const seat = String(randomSeatParameters.seat).padStart(2, '0');
    // Клик по выбранному месту:
    await clickBySelector(
      page,
      `.buying-scheme__row:nth-child(${randomRowParameters.row}) > span:nth-child(${seat})`
    );

    return `${randomRowParameters.row}.${seat}`;
  },

  getSeatFromDecimal(arrOfNum) {
    let row;
    let seat;
    const arrOfSeats = [];
    for (num of arrOfNum) {
      row = Math.floor(num);
      seat = Math.round((num % 1) * 100);
      arrOfSeats.push(`${row}/${seat}`);
    }
    return arrOfSeats;
  }
};
