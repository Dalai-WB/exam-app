import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() topic: number = 1;

  constructor(private router: Router) {
    
  }

  onGetDetail() {
    this.router.navigate(
      ['/details'],
      { queryParams: { id: this.topic } },
    );
  }
}
