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
  @Input() isFirst: boolean | null = null;
  role: String = '';
  status: String = '';
  warningVisible: boolean = false

  constructor(private router: Router, private auth: AuthenticationService, private msg: MessageService) { }

  ngOnInit() {
    console.log(this.badgeValue);
    this.role = this.auth.getUserRole() ?? '';
    this.status = this.auth.getUserStatus() ?? '';
  }

  onGetDetail() {
    if (!this.isFirst && this.status === 'pending') {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Таны бүртгэл одоогоор идэвхгүй байна. Төлбөрөө төлж бүртгэлээ идэвхжүүлнэ үү.',
      });
      return
    }
    if (this.exam.status === 'locked' && this.role === 'student') {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Та сорилгоо дарааллын дагуу хийнэ үү!',
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

    if (this.badgeValue !== null) {
      this.router.navigate(['/details'], {
        queryParams: { id: this.exam['_id'] },
      });
      return;
    }
    this.warningVisible = true
  }

  studentExam() {
    this.router.navigate(['/details'], {
      queryParams: { id: this.exam['_id'] },
    });
  }
}
