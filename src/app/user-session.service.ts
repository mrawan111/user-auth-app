// user-session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

interface LoginResponse {
  userSessionToken: string;
  LoginUserInfo: any;
  // Add other potential properties from the response if needed
}

@Injectable({ providedIn: 'root' })
export class UserSessionService {
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


   const body =    {
        "LoginUserInfo": {
            "loginUserName": "A_somaya",
            "companyName": "NTG",
            "sessionLanguage":"en"  //en English  ar Arabic
        },
        "Password": "P@ssw0rd"
    }


    console.log('=== REQUEST DETAILS ===');
    console.log('URL:', this.loginApiUrl);
    console.log('Headers:', JSON.stringify(Object.fromEntries(headers.keys().map(key => [key, headers.get(key)]))));
    console.log('Body:', JSON.stringify(body, null, 2));
    console.log('========================');

    return this.http.post<LoginResponse>(this.loginApiUrl, body, {
      headers,
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('=== RESPONSE SUCCESS ===');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Body:', response.body);
        // Based on the Postman collection, the token is in `userSessionToken`.
        if (response.body && response.body.userSessionToken) {
          this.setSessionToken(response.body.userSessionToken);
          this.setUser(response.body.LoginUserInfo);
        }
      }),
      map(response => response.body), // Extract and return the body for the subscriber
     // user-session.service.ts - Improved error handling
catchError(error => {
  console.log('=== RESPONSE ERROR ===');
  console.log('Status:', error.status);
  console.log('Status Text:', error.statusText);
  
  // Log the complete error object for debugging
  console.log('Complete error object:', error);

  if (error.error) {
    // Check if error is a string (could be HTML error page)
    if (typeof error.error === 'string') {
      console.log('Error response is string (possibly HTML):', error.error.substring(0, 200));
      return throwError(() => new Error('Server returned an HTML error page. Check API endpoint.'));
    }
    
    // The error seems to be a JSON object with a `restException` property.
    if (typeof error.error === 'object' && error.error.restException) {
      const restException = error.error.restException;
      console.log('Error Code:', restException.errorCode);
      console.log('Error Message:', restException.errorMessage);
      // Re-throw a more structured error for the component to use.
      return throwError(() => new Error(restException.errorMessage || 'An unknown server error occurred.'));
    } else {
      // Handle cases where the error is not in the expected format
      console.log('Error response body (not in expected format):', error.error);
      return throwError(() => new Error(error.error.message || 'Unexpected server response format.'));
    }
  }

  // Construct a user-friendly error message from the HTTP status
  const message = `Server error: ${error.status} ${error.statusText}`;
  return throwError(() => new Error(message));
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
  if (!sessionToken) throw new Error('No session token available for API call.');
  const headers = new HttpHeaders({
    'SessionToken': sessionToken,
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
