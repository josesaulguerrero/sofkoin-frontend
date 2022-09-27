import { commandPublishP2POffer } from './../../models/commands/commandPublishP2POffer';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { TokenResponse } from 'src/app/models/tokenResponseModel';
import { commandFundWallet } from 'src/app/models/commands/commandFundWallet';
import { TradeTransactionCommited } from 'src/app/models/events/TradeTransactionCommited';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private client: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  host: string = 'https://sofkoin-alpha-1117.herokuapp.com';
  // host: string = 'http://localhost:8070';

  signUpMethod(command: any): Observable<Object> {
    return this.client.post<any>(
      this.host + '/auth/signup',
      command,
      this.httpOptions
    );
  }

  loginMethod(command: any): Observable<TokenResponse[]> {
    return this.client.post<TokenResponse[]>(
      this.host + '/auth/login',
      command,
      this.httpOptions
    );
  }

  logout(command: any, token: string): Observable<any> {
    return this.client.post(this.host + '/auth/logout', command, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  p2pTransactionMethod(command: any, token: string): Observable<Object> {
    console.log(command);
    return this.client.post<any>(this.host + '/transaction/p2p', command, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  tradeTransactionMethod(
    command: any,
    token: string
  ): Observable<Array<TradeTransactionCommited>> {
    console.log(command);
    return this.client.post<Array<TradeTransactionCommited>>(
      this.host + '/transaction/trade',
      command,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  fundMethod(command: any, token: string): Observable<Object> {
    console.log(command.cashAmount + ' ' + command.userId + ' ' + token);
    return this.client.post<any>(this.host + '/transaction/fund', command, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  saveMessageMethod(command: any, token: string): Observable<Object> {
    console.log(command.cashAmount + ' ' + command.userId + ' ' + token);
    return this.client.post<any>(this.host + '/message/save', command, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }
  updateMessageMethod(command: any, token: string): Observable<Object> {
    console.log(command.cashAmount + ' ' + command.userId + ' ' + token);
    return this.client.post<any>(this.host + '/update/status', command, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }
  publishOfferMethod(
    command: commandPublishP2POffer,
    token: string
  ): Observable<Object> {
    return this.client.post<any>(this.host + '/market/publish/offer', command, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }
  deleteOfferMethod(command: any, token: string): Observable<Object> {
    console.log(command);

    return this.client.patch<any>(this.host + '/market/delete/offer', command, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return error;
    };
  }
}
