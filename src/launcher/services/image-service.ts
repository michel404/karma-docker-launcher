import {Docker} from 'node-docker-api';
import {streamToRx} from 'rxjs-stream';
import {first} from 'rxjs/operators';
import {Log} from '../missing-types';
import ReadableStream = NodeJS.ReadableStream;


export class ImageService {

  constructor(private log: Log, private docker: Docker) {
  }

  async getImage(imageId: string) {
    while (!await this.isImageAvailable(imageId)) {
      this.log.info(`Unable to find image '${imageId}' locally`);
      await this.pullImage(imageId);
      this.log.info(`Done pulling`);
    }
    this.log.info(`Image '${imageId}' is available locally`);
  }


  private async isImageAvailable(imageId: string) {
    try {
      await this.docker.image.get(imageId).status();
    } catch (error) {
      return false;
    }
    return true;
  }

  private async pullImage(imageId: string) {
    const pullingStatus = streamToRx<Buffer>(
      await this.docker.image.create({}, {fromImage: imageId}) as ReadableStream,
    );
    pullingStatus.subscribe(
      buffer => this.log.debug('Streaming status:', buffer.toString()),
      buffer => {
        throw Error('Something went wrong when pulling image:' + buffer.toString());
      },
      () => this.log.debug('Streaming done'),
    );
    pullingStatus.pipe(first()).subscribe(buffer => this.log.info(JSON.parse(buffer.toString()).status));
    await pullingStatus.toPromise();
  }
}
