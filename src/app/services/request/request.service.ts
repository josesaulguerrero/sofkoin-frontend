import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

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
    //  return this.client.post<any>('http://localhost:8080/auth/login',
    return this.client
      .post<any>('http://localhost:8070/auth/signup', command, this.httpOptions)
      .pipe(catchError(this.handleError<any>('signup')));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return error;
    };
  }
}
