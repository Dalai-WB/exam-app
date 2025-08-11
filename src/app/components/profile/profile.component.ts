import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePicture: string = 'assets/images/Unknown_person.jpg'; // placeholder image

  student = {
    name: 'John Doe',
    email: 'john@example.com',
    completedExams: 8,
    averageScore: 92,
    totalPoints: 735
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.student.name],
      email: [{ value: this.student.email, disabled: true }]
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
