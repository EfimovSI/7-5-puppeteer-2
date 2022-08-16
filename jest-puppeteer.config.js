module.exports = {
  launch: {
    // здесь можем указывать все глобальные параметры запуска браузера для функции launch()
    slowMo: 20,
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'] // используем максимальный размер окна браузера
  }
};
