import { Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root',
})
export class StompService extends RxStomp {
  private WSEndpoint: string;

  constructor() {
    super();
    this.WSEndpoint = 'wss://sofkoin-gamma-1117.herokuapp.com/ws';
    // this.WSEndpoint = 'ws://localhost:8090/ws';
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
