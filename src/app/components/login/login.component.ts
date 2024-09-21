import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) {

  }

  onLogin() {
    this.auth.signIn({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => this.router.navigate(['home']),
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

}
