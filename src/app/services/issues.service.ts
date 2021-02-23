import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue';
import { environment } from './../../environments/environment';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  constructor(
    public http: HttpClient
  ) { }

  get() {
    return this.http.get( `${environment.apiUrl}/addresses` )
    .pipe(
      map ( (resp: any) => {
        return resp;
      }),
      catchError( this.showErrors )
    );
  }

  create(issue: Issue) {
    return this.http.post( `${environment.apiUrl}/addresses`, issue )
    .pipe(
      map ( (resp: any) => {
        return resp;
      }),
      catchError( this.showErrors )
    );
  }

  update(issue: Issue) {
    return this.http.put( `${environment.apiUrl}/addresses/${issue.code}`, issue )
    .pipe(
      map ( (resp: any) => {
        return resp;
      }),
      catchError( this.showErrors )
    );
  }

  delete(code: string) {
    return this.http.delete( `${environment.apiUrl}/addresses/${code}`, { } )
    .pipe(
      map ( (resp: any) => {
        return resp;
      }),
      catchError( this.showErrors )
    );
  }

  showErrors(err: HttpErrorResponse) {
    // return throwError(err.statusText);
    return Observable.throw(err);
  }
}
