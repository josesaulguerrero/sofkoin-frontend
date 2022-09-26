import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { TokenResponse } from 'src/app/models/tokenResponseModel';
import { commandFundWallet } from 'src/app/models/commands/commandFundWallet';
import { UserModel } from 'src/app/models/UserModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { CryptoPrice } from 'src/app/models/cryptoprice';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { MarketModel } from 'src/app/models/marketmodel';
@Injectable({
  providedIn: 'root',
})
export class BetarequestService {
  constructor(private client: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  host: string = 'https://sofkoin-beta-1117.herokuapp.com';
<<<<<<< HEAD

  //host: string = 'http://localhost:8080';
=======
  // host: string = 'http://localhost:8080';
>>>>>>> fa521853d3671672630a1b59e4ada9b14667e5b2

  getUserByIdMethod(id: string): Observable<UserModel> {
    console.log(this.host + '/view/user/' + id);
    return this.client.get<UserModel>(this.host + '/view/user/' + id);
  }
  geAllUserMethod(): Observable<UserModel[]> {
    return this.client.get<UserModel[]>(this.host + '/view/user/all');
  }

  geAllMarketsMethod(): Observable<MarketModel[]> {
    return this.client.get<MarketModel[]>(this.host + '/view/market/all');
  }
  geAllCryptoPriceMethod(): Observable<CryptoPriceModel[]> {
    return this.client.get<any>(this.host + '/view/cryptos/price');
  }
}
