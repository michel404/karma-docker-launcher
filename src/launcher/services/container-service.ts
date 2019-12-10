import {Docker} from 'node-docker-api';
import {Container} from 'node-docker-api/lib/container';
import {ContainerData, CreateOptions, Log} from '../missing-types';

function getContainerName(container: Container) {
  const data = container.data as ContainerData;
  return data.Name.replace('/', '');
}

export class ContainerService {

  constructor(private log: Log, private docker: Docker) {
  }

  async startContainer(createOpts: CreateOptions) {
    this.log.debug(`Starting container with image ${createOpts.Image}`);

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
