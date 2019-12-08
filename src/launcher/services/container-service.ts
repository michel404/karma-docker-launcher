import {Docker} from 'node-docker-api';
import {Container} from 'node-docker-api/lib/container';
import {IMAGE, NAME} from '../docker-constants';
import {Log} from '../missing-types';

function getContainerName(container: Container | null) {
  if (container === null) {
    return null;
  }
  const name: string = container.data[NAME];
  return name.replace('/', '');
}

export class ContainerService {

  constructor(private log: Log, private docker: Docker) {
  }

  async startContainer(createOpts: object) {
    this.log.debug(`Starting container with image ${createOpts[IMAGE]}`);

    let container = await this.docker.container.create(createOpts);
    container = await container.start();
    container = await container.status();
    this.log.info(`Container created (${getContainerName(container)})`);

    return container;
  }

  async stopContainer(container: Container | null) {
    this.log.debug(`Stopping/deleting container`);

    if (container === null) {
      this.log.debug('No container to stop/delete');
      return null;
    }

    await container.stop();
    await container.delete({force: true});

    this.log.info(`Container deleted (${getContainerName(container)})`);

    return null;
  }
}
