import { Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class StompService extends RxStomp {
  private WSEndpoint: string;

  constructor() {
    super();
    this.WSEndpoint = environment.gammaURl;
    super.configure(this.getConfig());
  }

  private getConfig(): RxStompConfig {
    return {
      brokerURL: this.WSEndpoint,
      reconnectDelay: 500,
      // debug: console.log,
    };
  }
}
