import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { TokenResponse } from 'src/app/models/tokenResponseModel';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private client: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  signUpMethod(command: any): Observable<Object> {
    console.log(command);
    //  return this.client.post<any>('http://localhost:8080/auth/login' https://sofkoin-alpha-1234.herokuapp.com,
    return this.client.post<any>(
      'http://localhost:8070/auth/signup',
      command,
      this.httpOptions
    );
  }

  loginMethod(command: any): Observable<TokenResponse[]> {
    return this.client.post<TokenResponse[]>(
      'http://localhost:8070/auth/login',
      command,
      this.httpOptions
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return error;
    };
  }
}
