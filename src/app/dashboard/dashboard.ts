import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { UserSessionService } from '../user-session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  user: any = null;
  apiResult: any = null;
  formattedResult: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(private router: Router, private userSession: UserSessionService, private cdr: ChangeDetectorRef) {}
  
  ngOnInit() {
    this.user = this.userSession.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    } else {
      this.callExternalApi();
    }
  }

  callExternalApi() {
    this.loading = true;
    this.error = null;
    const sessionToken = this.userSession.getSessionToken();
    console.log('Session Token for API call:', sessionToken);
    this.userSession.callExternalApi().subscribe({
      next: (result: any) => {
        console.log('API call successful, result:', result);
        this.apiResult = result;
        this.formattedResult = this.formatApiResult(result);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('API Call Error:', err);
        let errorMessage = 'An unknown error occurred.';
        if (err.status === 401) {
          errorMessage = 'Unauthorized: The session token may be invalid or expired.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        this.error = `Failed to call external API (Status: ${err.status}). ${errorMessage}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatApiResult(result: any): string {
    if (!result) return 'No data available';
    
    try {
      return JSON.stringify(result, null, 2);
    } catch (e) {
      return 'Error formatting API response';
    }
  }

  logout() {
    this.userSession.setUser(null);
    this.userSession.setSessionToken(null);
    this.router.navigate(['/login']);
  }
}
