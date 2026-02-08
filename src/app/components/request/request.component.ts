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
  isVisible: boolean = false;
  pendingUsers: any[] = [];
  loading: boolean = false;
  duration: number = 0;
  user: any;
  stateOptions: any[] = [
    { label: 'Хүлээгдэж буй', value: 'pending' },
    { label: 'Зөвшөөрсөн', value: 'active' },
  ];
  reqState: string = 'pending';

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: RequestService,
    private msg: MessageService,
  ) { }

  ngOnInit() {
    this.pendingUsers = this.activatedRoute.snapshot.data['users'];
    this.pendingUsers = this.pendingUsers.filter((user: any) => user.status === 'pending' && user.role !== 'admin');
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
    this.user = user;
    this.isVisible = true;
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

  onApproveWithDuration() {
    this.service.approveUser(this.user._id, this.duration).subscribe(
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
    this.isVisible = false
    this.user = null;
    this.duration = 0;
  }

  onStateChange() {
    this.loading = true;
    if (this.reqState === 'pending') {
      this.service.getPendingRequests().subscribe(
        (response: any) => {
          this.pendingUsers = response;
          this.loading = false;
        }
      );
    } else {
      this.service.getActiveRequests().subscribe(
        (response: any) => {
          this.pendingUsers = response;
          this.loading = false;
        }
      );
    }
  } 
}
