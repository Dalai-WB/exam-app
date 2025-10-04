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
  profilePicture: string = 'assets/images/Unknown_person.jpg'; // placeholder image
  student: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    console.log(data['userData']);
    this.student = data['userData'];
    this.profileForm = this.fb.group({
      name: [this.student.firstName],
      email: [{ value: this.student.username, disabled: true }]
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.profilePicture = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    console.log('Saving:', {
      ...this.student,
      name: this.profileForm.value.name,
      profilePicture: this.profilePicture
    });
    // TODO: Call your API here
  }
}
