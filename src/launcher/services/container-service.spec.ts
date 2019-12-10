import * as Docker from 'node-docker-api';
import {Log} from '../missing-types';
import {ContainerService} from './container-service';

describe('ContainerService', () => {

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
  const container = {
    data: {
      Name: 'test-container',
    },
    start: async () => container,
    status: async () => container,
    stop: async () => container,
    delete: async () => container,
  };
  const docker = {
    container: {
      create: async () => container,
    },
  };

  beforeEach(() => {
    /* Apply mocks */
    spyOn(Docker, 'Docker');
  });

  describe('when constructing', () => {
    let containerService;

    beforeEach(() => {
      containerService = new ContainerService(log, docker as never);
    });

    it('should be constructed', () => {
      expect(containerService).toBeDefined();
    });

    describe('when starting container', () => {
      const createOptions = {};
      let result;
      let startSpy;
      let statusSpy;

      beforeEach(async () => {
        startSpy = spyOn(container, 'start').and.callThrough();
        statusSpy = spyOn(container, 'status').and.callThrough();
        result = await containerService.startContainer(createOptions);
      });

      it('should start the container', () => {
        expect(startSpy).toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalled();
      });

      it('should return the container', () => {
        expect(result).toBe(container);
      });

    });

    describe('when stopping a container', () => {
      let result;
      let stopSpy;
      let deleteSpy;

      beforeEach(async () => {
        stopSpy = spyOn(container, 'stop').and.callThrough();
        deleteSpy = spyOn(container, 'delete').and.callThrough();
        result = await containerService.stopContainer(container);
      });

      it('should start the container', () => {
        expect(stopSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });

    });

    describe('when stopping but no container is provided', () => {
      let result;
      let stopSpy;
      let deleteSpy;

      beforeEach(async () => {
        stopSpy = spyOn(container, 'stop').and.callThrough();
        deleteSpy = spyOn(container, 'delete').and.callThrough();
        result = await containerService.stopContainer(null);
      });

      it('should start the container', () => {
        expect(stopSpy).not.toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });

    });

  });

});
