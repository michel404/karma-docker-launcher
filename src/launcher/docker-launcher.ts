import {Docker} from 'node-docker-api';
import {Container} from 'node-docker-api/lib/container';
import {Arguments} from './arguments';
import {CONFIG, IMAGE} from './docker-constants';
import {CallbackType, KarmaLauncher, Log, Logger} from './missing-types';
import {ContainerService} from './services/container-service';
import {ImageService} from './services/image-service';

const KARMA_URL_CONST = '$KARMA_URL';
const DEFAULT_SOCKET_PATH = '/var/run/docker.sock';

function injectUrlInCreateOptions(url: string, createOptions: object) {
  return JSON.parse(JSON.stringify(createOptions).replace(KARMA_URL_CONST, url)) as object;
}

export class DockerLauncher implements KarmaLauncher {
  readonly name = 'DockerLauncher';

  private browserProcessFailure: () => void;
  private done: () => void;
  private captured = false;

  private container: Container | null = null;

  private readonly log: Log;
  private readonly docker: Docker;
  private readonly imageService: ImageService;
  private readonly containerService: ContainerService;

  constructor(private readonly id: string, private readonly logger: Logger, private readonly args: Arguments) {
    this.validateArgs();

    this.log = logger.create(this.name);
    this.docker = new Docker({socketPath: this.args.socketPath});
    this.imageService = new ImageService(this.log, this.docker);
    this.containerService = new ContainerService(this.log, this.docker);

    this.log.debug('DockerLauncher constructed');
  }

  async start(url: string) {
    this.log.debug('Received: start');

    const createOptions = injectUrlInCreateOptions(`${url}?id=${this.id}`, this.args.createOptions);

    await this.imageService.getImage(createOptions[IMAGE]);
    this.container = await this.containerService.startContainer(createOptions);
  }

  async forceKill() {
    this.log.debug('Received: force kill');

    this.container = await this.containerService.stopContainer(this.container);
  }

  on(callbackType: CallbackType, callbackFunction: () => void) {
    switch (callbackType) {
      case 'browser_process_failure':
        this.browserProcessFailure = callbackFunction;
        break;
      case 'done':
        this.done = callbackFunction;
        break;
      default:
        this.log.warn(`Unknown callback function registered: ${callbackType}`);
        return;
    }
    this.log.debug(`Registered callback function for '${callbackType}'`);
  }

  markCaptured() {
    const imageId: string = this.container.data[CONFIG][IMAGE];
    this.log.info(`The browser of '${imageId}' in is successfully captured`);
    this.captured = true;
  }

  isCaptured() {
    this.log.debug(`Captured: ${this.captured}`);
    return this.captured;
  }

  private validateArgs() {
    if (this.args.socketPath === undefined) {
      this.args.socketPath = DEFAULT_SOCKET_PATH;
    }
    if (this.args.createOptions === undefined) {
      throw Error(`Argument 'createOptions' is missing.\n` +
        `You cannot run 'Docker' as browser without extra arguments in customLaunchers in karma.conf.` +
        `Please refer to README.md for instructions and examples. \n` +
        `Check the documentation of the Docker Engine Api for '/containers/create' to ` +
        `see the available create options.`);
    }
    if (this.args.createOptions[IMAGE] === undefined) {
      throw Error(`Argument 'createOptions.Image' is missing. ` +
        `Check the documentation of the Docker Engine Api for '/containers/create' to ` +
        `see the available create options.`);
    }
  }
}
