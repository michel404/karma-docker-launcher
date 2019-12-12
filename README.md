# karma-docker-launcher
![GitHub Actions build status
](https://github.com/michel404/karma-docker-launcher/workflows/build/badge.svg?branch=master)

A Karma plugin. Launcher for headless browsers in Docker containers.

> Run your Karma tests on a headless browser in a Docker container.

## Why?

When running tests in e.g. ChromeHeadless, you need a locally installed
Chrome binary and the environment variable `CHROME_BIN` pointing to its
location. It is more convenient to run your headless browsers in a Docker
container, especially during automated builds. This package allows you to do
just that.

It uses the Docker Engine API, so it can even run without Docker binary,
which is useful when Karma itself is running inside a node container.

This package is easily configurable for testing in Chrome, Firefox or any
other browser that runs inside a Docker container.  

## Installation
The easiest way is to keep `karma-docker-launcher` as a devDependency in your
`package.json`.

You can simple do it by:

```shell script
npm install karma-docker-launcher --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadlessDocker', 'FirefoxHeadlessDocker'],
    customLaunchers: {
      ChromeHeadlessDocker: {
        base: 'Docker',   
        modemOptions: {
          socketPath: '/var/run/docker.sock'
        },
        createOptions: {
          Image: 'alpeware/chrome-headless-trunk',
          Env: ['CHROME_OPTS=$KARMA_URL'],
          HostConfig: {
            NetworkMode: 'host'
          }
        }
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
            NetworkMode: 'host'
          }
        }
      }
    }                 
   });
};
```

* `modemOptions` is specified by the `docker-modem` package. Please refer to
[their REAMDE.md](https://github.com/apocas/docker-modem#getting-started)
to see the available options. 

* `createOptions` is specified by de Docker Engine API. Only `Image` is
required. Please refer to [the official Docker docs
](https://docs.docker.com/engine/api/v1.30/#operation/ContainerCreate) to
see all available options.   

* All occurrences of `$KARMA_URL` will be replaced by the actual url provided
by Karma; typically `http://localhost:9876/?id=1234`.

## Running Karma

Running Karma can be done in two ways:

* Directly, e.g. using `npm run test`.

* In a docker container, e.g. using `docker run (...) node npm run test`.

## Examples

See the example application in the [examples
](https://github.com/michel404/karma-docker-launcher/tree/master/examples
) folder. Most notably are the configuration file `karma.conf.js` and the
scripts in the `scripts` folder.  

## Alternatives

This package differs from
[karma-chrome-launcher](https://www.npmjs.com/package/karma-chrome-launcher) and
[karma-firefox-launcher](https://www.npmjs.com/package/karma-firefox-launcher)
in one important way. The Chrome and Firefox launchers need the binaries to be
installed locally, while this package only needs a Docker daemon to talk to. 

This package is inspired by
[@rkuzsma/karma-docker-launcher
](https://www.npmjs.com/package/@rkuzsma/karma-docker-launcher)
but works essentially differently.
Because this package manages the containers via the Docker Engine rather than
the Docker CLI, it is possible to run Karma itself in a Docker.

----

For more information on Karma see the
[homepage](https://karma-runner.github.io).
