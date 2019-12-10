import * as Docker from 'node-docker-api';
import {Readable} from 'stream';
import {Log} from '../missing-types';
import {ImageService} from './image-service';

describe('ImageService', () => {

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
  const docker = {
    image: {
      get: () => ({}),
      create: () => ({}),
    },
  };

  beforeEach(() => {
    /* Apply mocks */
    spyOn(Docker, 'Docker');
  });

  describe('when constructing', () => {
    let imageService: ImageService;

    beforeEach(() => {
      imageService = new ImageService(log, docker as never);
    });

    it('should be constructed', () => {
      expect(imageService).toBeDefined();
    });

    describe('when image is available', () => {
      let getSpy: jasmine.Spy;
      let createSpy: jasmine.Spy;

      beforeEach(() => {
        getSpy = spyOn(docker.image, 'get').and.returnValue({
          status: () => new Promise(resolve => resolve()),
        });
        createSpy = spyOn(docker.image, 'create');
      });

      describe('when getting image', () => {
        const imageId = 'hello-world';

        beforeEach(async () => {
          await imageService.getImage(imageId);
        });

        it('should check that image exits', () => {
          expect(getSpy).toHaveBeenCalled();
        });

        it('should not try to pull that image', () => {
          expect(createSpy).not.toHaveBeenCalled();
        });
      });

    });

    describe('when image is not available', () => {
      let getSpy: jasmine.Spy;
      let triesRemaining: number;

      beforeEach(() => {
        getSpy = spyOn(docker.image, 'get').and.returnValue({
          status: () => {
            if (triesRemaining > 0) {
              throw new Error();
            } else {
              return () => new Promise(resolve => resolve());
            }
          },
        });

      });

      describe('when pulling the image succeeds', () => {
        let createSpy: jasmine.Spy;

        beforeEach(() => {
          triesRemaining = 1;
          createSpy = spyOn(docker.image, 'create').and.callFake(
            () => {
              const readable = new Readable();
              readable.push('{"status": "first message"}');
              readable.push('{"status": "second message"}');
              readable.push('{"status": "last message"}');
              readable.push(null);
              triesRemaining--;
              return readable;
            },
          );
        });

        describe('when getting image', () => {
          const imageId = 'hello-world';

          beforeEach(async () => {
            await imageService.getImage(imageId);
          });

          it('should check that image exits', () => {
            expect(getSpy).toHaveBeenCalled();
          });

          it('should try to pull that image', () => {
            expect(createSpy).toHaveBeenCalled();
          });

        });

      });

      describe('when pulling the image fails', () => {
        let createSpy;

        beforeEach(() => {
          triesRemaining = 1;
          createSpy = spyOn(docker.image, 'create').and.callFake(
            () => {
              const readable = new Readable();
              readable.push('{"status": "first message"}');
              readable.push('{"status": "second message"}');
              readable.push('{"status": "last message"}');
              readable.emit('error');
              return readable;
            },
          );
        });

        it('should throw an error when getting image', () => {
          const imageId = 'hello-world';

          expectAsync(
            imageService.getImage(imageId),
          ).toBeRejectedWithError();
        });

      });

    });

  });

});
