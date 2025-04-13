import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private msg: MessageService,
  ) { }

  onLogin() {
    this.auth
      .signIn({
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (res) => {
          if (res.status === undefined || res.status === 'pending') {
            this.auth.logOut().subscribe(
              response => {
                this.msg.add({
                  severity: 'error',
                  summary: 'Алдаа',
                  detail: 'Таны бүртгэл идэвхгүй байна. Админд хандана уу!',
                });
              }
            )
            return;
          }

          this.msg.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай нэвтэрлээ.',
          });
          this.router.navigate(['home']);
        }
      );
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
