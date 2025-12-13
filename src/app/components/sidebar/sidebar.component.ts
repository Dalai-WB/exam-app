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
  firstName: String = '';
  isOpen: boolean = false;
  constructor(public router: Router, private auth: AuthenticationService, private fireAuth: Auth) { }
  role: String = '';

  ngOnInit() {
    this.role = this.auth.getUserRole() ?? '';
    this.firstName = this.auth.getUserFirstName() ?? '';
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  onProfile() {
    this.router.navigate(['profile']);
    this.isOpen = false;
  }

  onStatistic() {
    this.router.navigate(['statistic']);
    this.isOpen = false;
  }

  onHome() {
    this.router.navigate(['home']);
    this.isOpen = false;
  }

  onRequests() {
    this.router.navigate(['requests']);
    this.isOpen = false;
  }

  onLogout() {
    this.auth.logOut().subscribe({
      next: () => this.router.navigate(['login']),
    });
  }
}
