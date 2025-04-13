import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DetailService } from '../../services/detail.service';
import { Auth } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  examForm: FormGroup;
  pageIndex: number = 1;
  activePage: string =
    'flex items-center justify-center px-4 h-10 border hover:bg-blue-100 hover:text-blue-700 border-gray-700 bg-gray-200 text-blue-600 w-12 rounded-md';
  regularPage: string =
    'flex items-center justify-center px-4 h-10 leading-tight text-white hover:text-white w-12 rounded-md';
  arr: number[] = [];
  answers: string[] = [];
  isFill: boolean = false;
  exam: any;
  questionText: string = '';

  timeLeft: number = 5400;
  timerInterval: any;

  isExamEnded: boolean = false;
  isAdmin: boolean = false;
  attempt: any;
  isReview: boolean = false;
  isVisible: boolean = false;
  answerString: String = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private msg: MessageService,
    private auth: Auth,
    private authService: AuthenticationService,
    private service: DetailService,
  ) {
    this.examForm = this.fb.group({
      _id: '',
      examName: [''],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.exam = data['exam']['exam'];
    this.attempt = data['exam']['userAttempt']
    this.timeLeft = this.exam.duration * 60;
    this.examForm.patchValue(this.exam);
    this.arr = this.exam.questions.map((x: any, i: any) => ++i);
    this.questionText = this.exam.questions[0].questionText;
    this.answers = this.exam.questions[0].choices;
    this.isFill = this.exam.questions[0].answerType === 'fill';

    if (this.authService.getUserRole() === 'admin' || this.authService.getUserRole() === 'teacher') {
      this.adminStart();
    } else {
      this.studentStart();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  adminStart() {
    this.populateQuestions(false);
    this.isAdmin = true;
    this.isExamEnded = true;
  }

  studentStart() {
    if (this.attempt === null) {
      this.populateQuestions(false);
      this.startTimer();
    } else {
      this.isReview = true;
      this.isExamEnded = true;
      this.populateQuestions(true);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.endExam();
      }
    }, 1000);
  }

  endExam() {
    if (this.isReview || this.authService.getUserRole() !== 'student') {
      this.router.navigate(['/home']);
      return;
    };
    this.saveResponses();
  }

  saveResponses() {
    console.log(this.examForm);
    if (this.examForm.valid) {
      clearInterval(this.timerInterval);
      const body = this.examForm.getRawValue();
      const fireId = this.auth.currentUser?.uid
      this.service.saveExamAttempt(fireId ?? '', body).subscribe(
        respones => {
          this.isExamEnded = true;
          this.router.navigate(['/home']);
          this.msg.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгаллаа',
          });
        },
        error => {
          this.msg.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Error occured saving response',
          });
        }
      );
    } else {
      this.msg.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Бүх асуултыг бөглөнө үү!',
      });
    }
  }

  onPageClick(question: number) {
    this.pageIndex = question;
    this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
    this.answers = this.exam.questions[this.pageIndex - 1].choices;
    this.isFill = this.exam.questions[this.pageIndex - 1].answerType === 'fill';
  }

  onNextClick() {
    if (this.pageIndex != this.exam.questions.length) {
      this.pageIndex++;
      this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
      this.answers = this.exam.questions[this.pageIndex - 1].choices;
      this.isFill = this.exam.questions[this.pageIndex - 1].answerType === 'fill';
    } else {
      this.endExam();
    }
  }

  onPreviousClick() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
      this.answers = this.exam.questions[this.pageIndex - 1].choices;
      this.isFill = this.exam.questions[this.pageIndex - 1].answerType === 'fill';
    }
  }

  preventArrowKeys(event: KeyboardEvent): void {
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  private padTime(time: number): string {
    return time < 10 ? '0' + time : time.toString();
  }

  replaceDollarPairsRecursively(input: string): string {
    const firstIndex = input.indexOf('$');
    const secondIndex = input.indexOf('$', firstIndex + 1);

    if (firstIndex === -1 || secondIndex === -1 || firstIndex === secondIndex) {
      return input;
    }

    let markedString =
      input.slice(0, firstIndex) +
      '[OPEN]' +
      input.slice(firstIndex + 1, secondIndex) +
      '[CLOSE]' +
      input.slice(secondIndex + 1);

    markedString = markedString
      .replace('[OPEN]', '\\(')
      .replace('[CLOSE]', '\\)');

    return this.replaceDollarPairsRecursively(markedString);
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  get arrFormGroup(): FormGroup {
    return this.questions.controls[this.pageIndex - 1] as FormGroup;
  }

  populateQuestions(isReview: boolean) {
    if (isReview) {
      const responses = this.attempt.responses as any[];
      console.log(responses);
      this.exam.questions.forEach((questionData: any, index: number) => {
        const responseQuestion = responses.find(res => res.question._id === questionData._id)
        this.questions.push(
          this.fb.group({
            selectedAnswer: [{value: responseQuestion.selectedAnswer, disabled: true}, Validators.required],
            correctAnswer: {value: responseQuestion.question.correctAnswer.replace(/&\d/g, ''), disabled: true},
            _id: [questionData._id, Validators.required],
            isCorrect: responseQuestion.isCorrect
          })
        );
      });
    } else {
      this.exam.questions.forEach((questionData: any, index: number) => {
        this.questions.push(
          this.fb.group({
            selectedAnswer: [null, Validators.required],
            _id: [questionData._id, Validators.required],
            answerType: [questionData.answerType, Validators.required],
          })
        );
      });
    }
  }

  getCheck(answer: any): any {
    const responses = this.attempt.responses as any[];
    const isCheck = responses.find(res => res.question._id === this.exam.questions[this.pageIndex - 1]['_id']).question.correctAnswer === answer;
    return isCheck
  }

  onAnswerClick() {
    this.answerString = '\\(\\begin{pmatrix}   1 & 0\\\\    -1 & 1 \\end{pmatrix}\\cdot \\begin{pmatrix}   1 & 3 & 5\\\\    2 & 4 & 6 \\end{pmatrix}\\) үржүүлэх үйлдлийг гүйцэтгэ.';
    this.isVisible = true;
  }
}
