import {IMAGE} from './docker-constants';

export class Arguments {
  socketPath: string;
  createOptions: {
    [IMAGE]: string,
  };
}
