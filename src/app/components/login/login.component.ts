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
  remember: Boolean = false;
  showForgotPassword: boolean = false;
  resetEmail: string = '';

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private msg: MessageService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    const rememberValue = localStorage.getItem('rememberValue');
    if (rememberValue === 'true') {
      const rememberEmail = localStorage.getItem('rememberEmail');
      if (rememberEmail) {
        this.email = rememberEmail;
        this.remember = true;
      }
    }
  }

  onLogin() {
    this.auth
      .signIn({
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (res) => {
          // if (res.status === undefined || res.status === 'pending') {
          //   this.auth.logOut().subscribe(
          //     response => {
          //       this.msg.add({
          //         severity: 'error',
          //         summary: 'Алдаа',
          //         detail: 'Таны бүртгэл идэвхгүй байна. Админд хандана уу!',
          //       });
          //     }
          //   )
          //   return;
          // }

          this.msg.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай нэвтэрлээ.',
          });
          if (this.remember) {
            console.log('remembered');
            localStorage.setItem('rememberEmail', this.email);
            localStorage.setItem('rememberValue', this.remember.toString());
          } else {
            localStorage.removeItem('rememberEmail');
            localStorage.removeItem('rememberValue');
          }
          this.router.navigate(['home']);
        }
      );
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  sendResetEmail() {
    if (!this.resetEmail) {
      this.msg.add({
        severity: 'error',
        summary: 'Алдаа',
        detail: 'Имэйл хаягаа оруулна уу.',
      });
      return;
    }

    this.authService.recoverPassword(this.resetEmail).subscribe(
      () => {
        this.msg.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Нууц үг сэргээх холбоос таны имэйл хаяг руу илгээгдлээ.',
        });
        this.showForgotPassword = false;
        this.resetEmail = '';
      },
      (error) => {
        this.msg.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: error.message,
        });
      }
    );
  }
}
