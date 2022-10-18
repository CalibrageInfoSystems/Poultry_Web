import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { AppConfig } from '../config/app.config';
import { Observable } from 'rxjs/internal/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient ) {
    // this._base_Url = AppConfig.getApiUrl();
   }

   /** GET heroes from the server */
   GetAll(url: string): Observable<any> {
       console.log(AppConfig.serviceBase_Url.base_Url);
    return this.http.get<any>(AppConfig.serviceBase_Url.base_Url + url)
    .pipe(
        tap(data => { console.log(AppConfig.serviceBase_Url.base_Url + url + ' successful'); }),
        catchError(this.handleError(AppConfig.serviceBase_Url.base_Url + url, []))
    );
}

/** GET hero by id. Will 404 if id not found */
Get(url: string, id: number): Observable<any> {
    
    return this.http.get<any>(AppConfig.serviceBase_Url.base_Url + url + '/' + id) 
    .pipe(
            tap(data => { console.log(AppConfig.serviceBase_Url.base_Url + url + ' successful'); }),
            catchError(this.handleError<any>(AppConfig.serviceBase_Url.base_Url + url))
        );

    // .map( (res) => {
    //     return res.json();
    // })
   
}
Post(url: string, req: any): Observable<any> {
     console.log(AppConfig.serviceBase_Url.base_Url)
     console.log(AppConfig.serviceBase_Url.base_Url + url)
    return this.http.post<any>(AppConfig.serviceBase_Url.base_Url + url, req, httpOptions)
    .pipe(
        tap(data => { console.log(AppConfig.serviceBase_Url.base_Url + url + ' successful'); }),
        catchError(this.handleError<any>(AppConfig.serviceBase_Url.base_Url + url))
    );
}



/** DELETE: delete the hero from the server */
Delete(url: string, id: number): Observable<any> {
return this.http.delete<any>(AppConfig.serviceBase_Url.base_Url + url + '/' + id)
.pipe(
    tap(data => { console.log(AppConfig.serviceBase_Url.base_Url + url + ' successful'); }),
    catchError(this.handleError<any>(AppConfig.serviceBase_Url.base_Url + url))
);
}
/** DELETE: delete the hero from the server */
Deleteincfeed(url: string, id: number): Observable<any> {
    return this.http.get<any>(AppConfig.serviceBase_Url.base_Url + url + '/' + id)
    .pipe(
        tap(data => { console.log(AppConfig.serviceBase_Url.base_Url + url + ' successful'); }),
        catchError(this.handleError<any>(AppConfig.serviceBase_Url.base_Url + url))
    );
    }

/** PUT: update the hero on the server */
Put(url: string, req: any): Observable<any> {
return this.http.put(AppConfig.serviceBase_Url.base_Url + url, req, httpOptions)
    .pipe(
        tap(data => { console.log(AppConfig.serviceBase_Url.base_Url + url + ' successful'); }),
        catchError(this.handleError<any>(AppConfig.serviceBase_Url.base_Url + url))
    );
}

/**
* Handle Http operation that failed.
* Let the app continue.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/
private handleError<T>(operation = 'operation', result?: T) {
return (error: any): Observable<T> => {

  // TODO: send the error to remote logging infrastructure
  console.error(error); // log to console instead

  // Let the app keep running by returning an empty result.
  return of(error as T);
};
}
}
