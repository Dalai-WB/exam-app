import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  pageIndex: number = 1;
  activePage: string = 'flex items-center justify-center px-4 h-10 border hover:bg-blue-100 hover:text-blue-700 border-gray-700 bg-gray-200 text-blue-600 w-12 rounded-md';
  regularPage: string = 'flex items-center justify-center px-4 h-10 leading-tight border bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white w-12 rounded-md';
  arr: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
  examId: number = 0;
  answers: string[] = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4']

  constructor (private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        console.log(params);
        this.examId = +params['id'];
      }
    );
  }

  onPageClick(question: number) {
    this.pageIndex = question;
  }

  onNextClick() {
    if (this.pageIndex != 40) {
      this.pageIndex++;
    }
  }

  onPreviousClick() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
    }
  }
  preventArrowKeys(event: KeyboardEvent): void {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }
}
