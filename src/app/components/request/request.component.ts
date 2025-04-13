import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss'
})
export class RequestComponent {

  pendingUsers: any[] = [];
  loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: RequestService,
    private msg: MessageService,
  ) { }

  ngOnInit() {
    this.pendingUsers = this.activatedRoute.snapshot.data['users'];
  }

  translations: { [key: string]: string } = {
    pending: 'Хүлээгдэж буй', // Translation for "pending"
    active: 'Идэвхтэй',       // Translation for "active"
    inactive: 'Идэвхгүй',     // Translation for "inactive" (if applicable)
    teacher: 'Багш',
    student: 'Сурагч'
  };

  onApprove(user: any) {
    console.log(user);
    this.service.approveUser(user._id).subscribe(
      (response: any) => {
        this.msg.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай зөвшөөрсөн',
        });
        const index = this.pendingUsers.findIndex((elm: any) => elm._id === response.user._id);
        if (index !== -1) {
          this.pendingUsers.splice(index, 1);
        }
      }
    );
  }

  onDecline(user: any) {
    this.loading = true;
    this.service.deleteUser(user._id).subscribe(
      (response: any) => {
        this.loading = false;
        this.msg.add({
          severity: 'success',
          summary: 'Амжилттай',
          detail: 'Амжилттай устгалаа',
        });
        const index = this.pendingUsers.findIndex((elm: any) => elm._id === response.id);
        if (index !== -1) {
          this.pendingUsers.splice(index, 1);
        }
      }
    )
  }

}
