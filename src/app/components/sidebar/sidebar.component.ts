import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  firstName: String = '';
  isOpen: boolean = false;
  role: String = '';
  status: String = '';

  constructor(
    public router: Router,
    private auth: AuthenticationService,
    private msg: MessageService,
  ) { }

  ngOnInit() {
    this.role = this.auth.getUserRole() ?? '';
    this.status = this.auth.getUserStatus() ?? '';
    this.firstName = this.auth.getUserFirstName() ?? '';
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  onProfile() {
    this.router.navigate(['profile']);
    this.isOpen = false;
  }

  onStatistic() {
    if (this.status === 'pending') {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Таны бүртгэл одоогоор идэвхгүй байна. Төлбөрөө төлж бүртгэлээ идэвхжүүлнэ үү.',
      });
      return
    }
    this.router.navigate(['statistic']);
    this.isOpen = false;
  }

  onHome() {
    this.router.navigate(['home']);
    this.isOpen = false;
  }

  onRequests() {
    this.router.navigate(['requests']);
    this.isOpen = false;
  }

  onLogout() {
    this.auth.logOut().subscribe({
      next: () => this.router.navigate(['login']),
    });
  }
}
