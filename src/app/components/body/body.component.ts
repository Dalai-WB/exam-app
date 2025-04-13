import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
})
export class BodyComponent implements OnInit {
  @Input() exams: any[] = [];
  isAdmin: boolean = false;
  adminExam = {
    examName: '+'
  };

  constructor(private auth: AuthenticationService) {

  }

  ngOnInit() {
    this.isAdmin = this.auth.getUserRole() === 'admin';
  }
}
