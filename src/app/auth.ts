// auth.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginApiUrl = '/api/rest/MainFunciton/login';
private externalApiUrl = '/api/rest/integration/GetGenericObject';


  private sessionToken: string | null = null;
  private user: any = null;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'SessionToken': 'NTG',
  'EncryptedPW': 'false'
});


   const body = {
  LoginUserInfo: {
    loginUserName: 'A_somaya',
    companyName: 'NTG',
    sessionLanguage: 'en'
  },
  Password: 'P@ssw0rd'
};

    console.log('=== REQUEST DETAILS ===');
    console.log('URL:', this.loginApiUrl);
    console.log('Headers:', JSON.stringify(Object.fromEntries(headers.keys().map(key => [key, headers.get(key)]))));
    console.log('Body:', JSON.stringify(body, null, 2));
    console.log('========================');

    return this.http.post(this.loginApiUrl, body, {
      headers,
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('=== RESPONSE SUCCESS ===');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Body:', response.body);
      }),
      map(response => response.body),
      catchError(error => {
        console.log('=== RESPONSE ERROR ===');
        console.log('Status:', error.status);
        console.log('Status Text:', error.statusText);

        if (error.error) {
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(error.error, "text/xml");
            const errorCode = xmlDoc.getElementsByTagName("ErrorCode")[0]?.textContent;
            const errorMessage = xmlDoc.getElementsByTagName("ErrorMessage")[0]?.textContent;

            console.log('Error Code:', errorCode);
            console.log('Error Message:', errorMessage);
            console.log('Full XML:', error.error);
          } catch (e) {
            console.log('Error response (not XML):', error.error);
          }
        }

        return throwError(() => error);
      })
    );
  }

  getSessionToken(): string | null {
    return this.sessionToken;
  }

  setSessionToken(token: string | null): void {
    this.sessionToken = token;
  }

  getUser(): any {
    return this.user;
  }

  setUser(user: any): void {
    this.user = user;
  }
callExternalApi(): Observable<any> {
  const sessionToken = this.getSessionToken();
  if (!sessionToken) {
    throw new Error('No session token available');
  }

  const headers = new HttpHeaders({
    'SessionToken': '1757532136322-1033-6843565229766858400',
    'excludeLargeObjects': 'true',
    'formName': 'cul',
    'moduleName': 'cul',
    'appKey': 'NAS',
    'recId': '7',
    'Content-Type': 'application/json'
  });

  return this.http.get(this.externalApiUrl, { headers });
}

}
