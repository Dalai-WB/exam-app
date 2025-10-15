import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  student: any;
  studentStats: any;
  top10: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: ProfileService,
    private auth: AuthenticationService,
    private msg: MessageService,
  ) { }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.student = data['userData'].user;
    this.studentStats = data['userData'].userStats;
    this.top10 = data['userData'].top10;
    this.top10.sort((a, b) => a.rank - b.rank);
    this.profileForm = this.fb.group({
      firstName: [this.student.firstName],
      username: [{ value: this.student.username, disabled: true }]
    });
  }

  saveProfile() {
    const body = {
      firstName: this.profileForm.controls['firstName'].value
    }
    this.service.updateUserProfile(body).subscribe((response: any) => {
      this.auth.setUserFirstName(response.user.firstName)
      this.msg.add({
        severity: 'success',
        summary: 'Амжилттай',
        detail: 'Амжилттай хадгаллаа',
      });

      // Refresh the page
      window.location.reload();
    })
  }
}
