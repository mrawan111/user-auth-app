import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  user: any = null;
  apiResult: any = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    } else {
      this.callExternalApi();
    }
  }

  callExternalApi() {
    this.loading = true;
    this.error = null;
    this.auth.callExternalApi().subscribe({
      next: (result) => {
        this.apiResult = result;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to call external API: ' + err.message;
        this.loading = false;
      }
    });
  }

  logout() {
    this.auth.setUser(null);
    this.auth.setSessionToken(null);
    this.router.navigate(['/login']);
  }
}
