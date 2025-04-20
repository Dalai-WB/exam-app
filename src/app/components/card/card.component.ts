import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() exam: any;
  @Input() badgeValue: number | null = null;
  role: String = '';

  constructor(private router: Router, private auth: AuthenticationService, private msg: MessageService) { }

  ngOnInit() {
    console.log(this.badgeValue);
    this.role = this.auth.getUserRole() ?? '';
  }

  onGetDetail() {
    if (this.exam.status === 'locked' && this.role === 'student') {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Өмнөх сорилоо өгсний дараа дараагийн сорилоо хийнэ үү!',
      });
      return
    }

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
