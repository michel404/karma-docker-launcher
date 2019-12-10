import * as Docker from 'node-docker-api';
import {Arguments} from './arguments';
import {DockerLauncher} from './docker-launcher';
import {CallbackType, Log, Logger} from './missing-types';
import * as ContainerService from './services/container-service';
import * as ImageService from './services/image-service';

describe('DockerLauncher', () => {

  const id = '12345';
  const log: Log = {
    debug() {
    },
    error() {
    },
    info() {
    },
    warn() {
    },
  };
  const logger: Logger = {
    create() {
      return log;
    },
  };

  const imageServiceMock = {
    getImage: () => {
    },
  };
  const containerServiceMock = {
    startContainer: () => {
    },
    stopContainer: () => {
    },
  };

  let dockerSpy: jasmine.Spy;
  let imageServiceSpy: jasmine.Spy;
  let containerServiceSpy: jasmine.Spy;

  beforeEach(() => {
    /* Apply mocks */
    dockerSpy = spyOn(Docker, 'Docker');
    imageServiceSpy = spyOn(ImageService, 'ImageService').and.returnValue(imageServiceMock as never);
    containerServiceSpy = spyOn(ContainerService, 'ContainerService').and.returnValue(containerServiceMock as never);
  });

  describe('when constructing', () => {
    const args = {
      socketPath: 'my-socket-path',
      createOptions: {
        Image: 'hello-world',
        Env: ['URL=$KARMA_URL'],
      },
    } as Arguments;
    let dockerLauncher: DockerLauncher;

    beforeEach(() => {
      dockerLauncher = new DockerLauncher(id, logger, args);
    });

    it('should be constructed', () => {
      expect(dockerLauncher).toBeDefined();
      expect(dockerSpy).toHaveBeenCalledWith({socketPath: 'my-socket-path'});
      expect(imageServiceSpy).toHaveBeenCalled();
      expect(containerServiceSpy).toHaveBeenCalled();
    });

    it('should receive callback function done', () => {
      const done = jasmine.createSpy('done');

      dockerLauncher.on('done', done);

      expect(done).not.toHaveBeenCalled();
      dockerLauncher['done']?.call({});
      expect(done).toHaveBeenCalled();
    });

    it('should receive callback function browser_process_failure', () => {
      const browserProcessFailure = jasmine.createSpy('browserProcessFailure');

      dockerLauncher.on('browser_process_failure', browserProcessFailure);

      expect(browserProcessFailure).not.toHaveBeenCalled();
      dockerLauncher['browserProcessFailure']?.call({});
      expect(browserProcessFailure).toHaveBeenCalled();
    });

    it('should warn when receiving unknown callback functions', () => {
      const unknown = jasmine.createSpy('unknown');
      const warn = spyOn(log, 'warn');

      dockerLauncher.on('unknown' as CallbackType, unknown);

      expect(unknown).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalled();
    });

    it('should report the browser as not captured', () => {
      const isCaptured = dockerLauncher.isCaptured();

      expect(isCaptured).toBeFalse();
    });

    describe('when captured', () => {

      beforeEach(() => {
        dockerLauncher.markCaptured();
      });

      it('should report the browser as captured', () => {
        const isCaptured = dockerLauncher.isCaptured();

        expect(isCaptured).toBeTrue();
      });

    });

    describe('when start signal is received', () => {
      const url = 'http://localhost:9876';
      let getImageSpy: jasmine.Spy;
      let startContainerSpy: jasmine.Spy;

      beforeEach(async () => {
        getImageSpy = spyOn(imageServiceMock, 'getImage');
        startContainerSpy = spyOn(containerServiceMock, 'startContainer');
        await dockerLauncher.start(url);
      });

      it('should get the image', () => {
        expect(getImageSpy).toHaveBeenCalled();
      });

      it('should start the container with the Karma url applied', () => {
        expect(startContainerSpy).toHaveBeenCalledWith({
          Image: 'hello-world',
          Env: ['URL=http://localhost:9876?id=12345'],
        });

      });

    });

    describe('when force kill signal is received', () => {
      let stopContainerSpy: jasmine.Spy;

      beforeEach(async () => {
        stopContainerSpy = spyOn(containerServiceMock, 'stopContainer');
        await dockerLauncher.forceKill();
      });

      it('should stop the container', () => {
        expect(stopContainerSpy).toHaveBeenCalled();
      });

    });

  });

  describe('when socketPath is missing', () => {
    const args: Arguments = {createOptions: {Image: 'hello-world'}};
    let dockerLauncher: DockerLauncher;

    beforeEach(() => {
      dockerLauncher = new DockerLauncher(id, logger, args);
    });

    it('should provide a default value', () => {
      expect(dockerLauncher['args'].socketPath).toBeDefined();
    });

  });

  describe('when createOptions is missing', () => {
    const args = {} as Arguments;
    let dockerLauncher: DockerLauncher;

    it('should throw', () => {
      expect(() => {
        dockerLauncher = new DockerLauncher(id, logger, args);
      }).toThrowError();
    });

  });

  describe('when Image is missing', () => {
    const args = {createOptions: {}} as Arguments;
    let dockerLauncher: DockerLauncher;

    it('should throw', () => {
      expect(() => {
        dockerLauncher = new DockerLauncher(id, logger, args);
      }).toThrowError();
    });

  });

});
