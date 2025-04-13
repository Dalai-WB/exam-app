import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  exams: any;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    let sa: any = this.activatedRoute.snapshot.data;
    this.exams = sa['exams'];
  }
}
