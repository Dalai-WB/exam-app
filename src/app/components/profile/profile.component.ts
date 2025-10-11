import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.student = data['userData'].user;
    this.studentStats = data['userData'].userStats;
    this.top10 = data['userData'].top10;
    this.top10.sort((a, b) => a.rank - b.rank);
    this.profileForm = this.fb.group({
      name: [this.student.firstName],
      email: [{ value: this.student.username, disabled: true }]
    });
  }

  saveProfile() {
    console.log('Saving:', {
      ...this.student,
      name: this.profileForm.value.name,
    });
    // TODO: Call your API here
  }
}
