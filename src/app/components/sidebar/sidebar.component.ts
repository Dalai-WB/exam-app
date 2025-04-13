import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  username: String = '';
  constructor(public router: Router, private auth: AuthenticationService, private fireAuth: Auth) { }
  role: String = '';

  ngOnInit() {
    user(this.fireAuth).subscribe((currentUser) => {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }
      this.username = currentUser.email ?? '';
    });
    this.role = this.auth.getUserRole() ?? '';
  }

  onStatistic() {
    this.router.navigate(['statistic']);
  }

  onHome() {
    this.router.navigate(['home']);
  }

  onRequests() {
    this.router.navigate(['requests']);
  }

  onLogout() {
    this.auth.logOut().subscribe({
      next: () => this.router.navigate(['login']),
    });
  }
}
