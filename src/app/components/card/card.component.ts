import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() exam: any;
  @Input() badgeValue: number | null = null;
  role: String = '';

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
    console.log(this.badgeValue);
    this.role = this.auth.getUserRole() ?? '';
  }

  onGetDetail() {
    if (!this.exam['_id']) {
      this.router.navigate(['/exam']);
      return;
    }

    if (this.role === 'admin') {
      this.router.navigate([`/exam/${this.exam['_id']}`]);
      return;
    }

    this.router.navigate(['/details'], {
      queryParams: { id: this.exam['_id'] },
    });
  }
}
