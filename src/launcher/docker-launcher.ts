import {Docker} from 'node-docker-api';
import {Container} from 'node-docker-api/lib/container';
import {Arguments} from './arguments';
import {CallbackType, ContainerData, CreateOptions, KarmaLauncher, Log, Logger} from './missing-types';
import {ContainerService} from './services/container-service';
import {ImageService} from './services/image-service';

const KARMA_URL_CONST = '$KARMA_URL';


function injectUrlInCreateOptions(url: string, createOptions: CreateOptions) {
  return JSON.parse(JSON.stringify(createOptions).replace(KARMA_URL_CONST, url)) as CreateOptions;
}

export class DockerLauncher implements KarmaLauncher {
  readonly name = 'DockerLauncher';

  private browserProcessFailure: (() => void) | null = null;
  private done: (() => void) | null = null;
  private captured = false;

  private container: Container | null = null;

  private readonly log: Log;
  private readonly docker: Docker;
  private readonly imageService: ImageService;
  private readonly containerService: ContainerService;

  constructor(private readonly id: string, private readonly logger: Logger, private readonly args: Arguments) {
    this.validateArgs();

    this.log = logger.create(this.name);
    this.docker = new Docker(this.args.modemOptions);
    this.imageService = new ImageService(this.log, this.docker);
    this.containerService = new ContainerService(this.log, this.docker);

    this.log.debug('DockerLauncher constructed');
  }

  async start(url: string) {
    this.log.debug('Received: start');

    const createOptions = injectUrlInCreateOptions(`${url}?id=${this.id}`, this.args.createOptions);

    await this.imageService.getImage(createOptions.Image);
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
    const imageId: string = (this.container?.data as ContainerData)?.Config.Image || 'unknown image';
    this.log.info(`The browser of '${imageId}' in is successfully captured`);
    this.captured = true;
  }

  isCaptured() {
    this.log.debug(`Captured: ${this.captured}`);
    return this.captured;
  }

  private validateArgs() {
    if (this.args.modemOptions === undefined) {
      this.args.modemOptions = {};
    }
    if (this.args.createOptions === undefined) {
      throw Error(`Argument 'createOptions' is missing.\n` +
        `You cannot run 'Docker' as browser without extra arguments in customLaunchers in karma.conf.` +
        `Please refer to README.md for instructions and examples. \n` +
        `Check the documentation of the Docker Engine Api for '/containers/create' to ` +
        `see the available create options.`);
    }
    if (this.args.createOptions.Image === undefined) {
      throw Error(`Argument 'createOptions.Image' is missing. ` +
        `Check the documentation of the Docker Engine Api for '/containers/create' to ` +
        `see the available create options.`);
    }
  }
}
