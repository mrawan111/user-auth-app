import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSessionService } from '../user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
// login.ts - Fix the credentials initialization
credentials = { username: 'A_somaya', company: 'NTG', language: 'en', password: 'P@ssw0rd' };
  constructor(private userSession: UserSessionService, private router: Router) {}

  onLogin() {
    console.log('Attempting login with credentials:', this.credentials);
    this.userSession.login(this.credentials).subscribe({
      next: (res: any) => {
        console.log('Login successful, response:', res);
        // Check for session token in response
        const sessionToken = res.userSessionToken || res.LoginUserInfo?.userSessionToken;
        const sendOTPToken = res.sendOTPToken;
        const checkOTPToken = res.checkOTPToken;

        if (sessionToken) {
          // The userSession service already sets the token and user in the 'tap' operator
          this.userSession.setUser({ username: this.credentials.username, company: this.credentials.company });
          this.router.navigate(['/dashboard']);
        } else if (sendOTPToken) {
          // Handle OTP required
          console.log('OTP required, token:', sendOTPToken);
          alert('OTP verification required. Please check your email/SMS for the code.');
          // TODO: Implement OTP verification flow
        } else {
          console.error('Login failed: No session token or OTP token received in response');
          console.error('Response structure:', Object.keys(res));
          alert('Login failed: Unexpected response format. Check console for details.');
        }
      },
      error: (err: any) => {
        console.error('Login error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error details:', err.error);
        alert('Login failed: ' + err.message);
      }
    });
  }
}
