// Karma configuration

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter',
      'karma-typescript'
    ],
    karmaTypescriptConfig: {bundlerOptions: {ignore: ['JSONStream', 'docker-modem']}},
    files: [{pattern: 'src/**/*.ts'}],
    preprocessors: {'src/**/*.ts': ['karma-typescript']},
    reporters: ['progress', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [
      /* In order to avoid a circular dependency, this project itself uses the regular old ChromeHeadless
         browser for unit tests. Please see the example app to see an example of karma.conf.js that uses the
         karma-docker-launcher. */
      'ChromeHeadless'
    ],
    singleRun: true,
    concurrency: Infinity
  });
};
