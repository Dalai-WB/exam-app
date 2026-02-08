import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  students: any[] = [];
  isTeacher: boolean = false;
  fireId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private authFire: Auth,
  ) { }

  ngOnInit() {
    if (this.auth.getUserRole() === 'teacher') {
      this.isTeacher = true;
      this.students = this.activatedRoute.snapshot.data['statistic'];
      if(this.students && this.students.length > 0) {
        this.students = this.students.map((student: any) => {
          student.display = student.firstName + ' ' + student.lastName + ' - ' + student.username;
          return student;
        });
      }
    } else {
      user(this.authFire).subscribe((currentUser) => {
        if (currentUser?.uid) {
          this.fireId = currentUser.uid;
        }
      });
    }
  }

  onStudentSelected(event: DropdownChangeEvent) {
    this.fireId = event.value;
  }
}
