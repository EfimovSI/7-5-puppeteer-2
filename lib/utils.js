const { clickBySelector } = require('./commands');

module.exports = {
  async chooseRandomSeat(page) {
    const rowsInHall = await page.$$('.buying-scheme__row');
    const seatsInRow = await page.$$(
      '.buying-scheme__row:nth-child(1) .buying-scheme__chair'
    );
    // Выбор рандомного ряда:
    let row = Math.ceil(Math.random() * rowsInHall.length);
    let seatsTaken = await page.$$(
      `.buying-scheme__row:nth-child(${row}) .buying-scheme__chair_taken` // - ЗАВЕРНУТЬ В ФУНКЦИЮ!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    );
    // Проверка, что не все места в ряду заняты:
    while (seatsTaken.length === seatsInRow.length) {
      row = Math.ceil(Math.random() * rowsInHall.length);
      seatsTaken = await page.$$(
        `.buying-scheme__row:nth-child(${row}) .buying-scheme__chair_taken`
      );
    }
    // Выбор рандомного места в ряду:
    let seat = Math.ceil(Math.random() * seatsInRow.length);

    // Проверка, что место не забронировано и не выбрано.
    // Через await (await element.getProperty("class")).jsonValue(); не вышло.
    // Вытянуть класс получилось только таким способом:
    let list = await page.$$(`div:nth-child(${row}) > span:nth-child(${seat})`);
    let classValueList = await list[0].getProperty('classList');
    let classValueJson = await classValueList.jsonValue(); // - ЗАВЕРНУТЬ В ФУНКЦИЮ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    while (classValueJson[2]) {
      seat = Math.ceil(Math.random() * seatsInRow.length);
      list = await page.$$(`div:nth-child(${row}) > span:nth-child(${seat})`);
      classValueList = await list[0].getProperty('classList');
      classValueJson = await classValueList.jsonValue();
    }

    // Форматирование места для сортировки:
    seat = String(seat).padStart(2, '0');
    // Клик по выбранному месту:
    await clickBySelector(
      page,
      `.buying-scheme__row:nth-child(${row}) > span:nth-child(${seat})`
    );

    return `${row}.${seat}`;
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
