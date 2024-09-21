import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {

  }

  onRegister() {
    if (this.password === this.confirmPassword) {
      from(this.authenticationService.createUser({
        email: this.email,
        password: this.password,
      })).subscribe({
        next: () => this.router.navigate(['home']),
      });
    }
  }
}
