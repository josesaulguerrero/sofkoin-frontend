import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/UserModel';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { MarketModel } from 'src/app/models/marketmodel';
import { environment } from '../../../environments/environment.dev';
@Injectable({
  providedIn: 'root',
})
export class BetarequestService {
  constructor(private client: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  host: string = environment.betaURl;

  getUserByIdMethod(id: string): Observable<UserModel> {
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
