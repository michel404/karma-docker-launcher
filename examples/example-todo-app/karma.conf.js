// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-docker-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/example-todo-app'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    customLaunchers: {
      ChromeHeadlessDocker: {
        base: 'Docker',
        modemOptions: {
          socketPath: '/var/run/docker.sock'
        },
        createOptions: {
          Image: 'alpeware/chrome-headless-trunk:latest',
          Env: ['CHROME_OPTS=$KARMA_URL'],
          HostConfig: {
            NetworkMode: 'host',
          },
        },
      },
      FirefoxHeadlessDocker: {
        base: 'Docker',
        modemOptions: {
          socketPath: '/var/run/docker.sock'
        },
        createOptions: {
          Image: 'rkuzsma/firefox-headless-stable:latest',
          Cmd: ['firefox', '-p', 'headless', '-headless', '-no-remote', '-url', '$KARMA_URL'],
          HostConfig: {
            NetworkMode: 'host',
          },
        },
      },
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessDocker', 'FirefoxHeadlessDocker'],
    singleRun: false,
    restartOnFileChange: true
  });
};
