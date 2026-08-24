/**
 * Configuracion de las pruebas.
 *
 * Angular funciona sin este archivo, pero se incluye por una razon: el
 * lanzador por defecto (ChromeHeadless) falla dentro de contenedores porque
 * ahi no se puede usar el sandbox de Chrome. Con este lanzador propio las
 * pruebas corren igual en tu Mac y en cualquier servidor de integracion.
 *
 * Uso:
 *     npm test
 *
 * Si Chrome no esta donde el sistema lo busca, se le indica asi:
 *     CHROME_BIN=/ruta/a/chrome npm test
 */
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    reporters: ['progress'],
    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: true,
  });
};
