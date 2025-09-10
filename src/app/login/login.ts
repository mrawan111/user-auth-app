import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  credentials = { username: '', company: 'NTG', language: 'en', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    console.log('Attempting login with credentials:', this.credentials);
    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Login successful, response:', res);
        // Check for session token in response
        const sessionToken = res.userSessionToken || res.LoginUserInfo?.userSessionToken;
        const sendOTPToken = res.sendOTPToken;
        const checkOTPToken = res.checkOTPToken;

        if (sessionToken) {
          this.auth.setSessionToken(sessionToken);
          this.auth.setUser({ username: this.credentials.username, company: this.credentials.company });
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
      error: err => {
        console.error('Login error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error details:', err.error);
        alert('Login failed: ' + (err.error?.message || err.message));
      }
    });
  }
}
