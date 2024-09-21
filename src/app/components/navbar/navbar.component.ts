import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private auth: AuthenticationService,
  ) {

  }

  onLogout () {
    this.auth.logOut().subscribe({
      next: () => this.router.navigate(['login']),
    });
  }

}
