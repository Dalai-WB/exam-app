import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { from } from 'rxjs';
import { MessageService } from 'primeng/api';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  stateOptions: any[] = [
    { label: 'Сурагч', value: 'student' },
    { label: 'Багш', value: 'teacher' },
  ];
  role: string = 'student';
  teachers: any[] = [];
  selectedTeacher: String = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private msg: MessageService,
    private service: RegisterService,
  ) {

  }

  ngOnInit() {
    this.onRoleChange();
  }

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Нууц үг адил биш байна.',
      });
      return;
    }

    if (this.selectedTeacher === '' && this.role === 'student') {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Багшаа сонгоно уу!',
      });
      return;
    }
    from(this.authenticationService.createUser({
      email: this.email,
      password: this.password,
    }, this.role, this.selectedTeacher)).subscribe(
      (res) => {
        console.log(res);
        console.log("-------");
        this.msg.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай бүртгүүллээ.',
        });
        this.authenticationService.logOut().subscribe(
          response => {
            this.router.navigate(['login']);
          }
        );
      }
    );
  }

  onRoleChange() {
    this.selectedTeacher = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    if (this.role === 'teacher') return;

    this.service.getTeachers().subscribe(
      (res: any) => {
        this.teachers = res;
      }
    )
  }

}
