import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DetailService } from '../../services/detail.service';
import { Auth } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service';
import { MathJaxParagraphComponent } from '../math-jax-paragraph/math-jax-paragraph.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('solutionMath') solutionMath!: MathJaxParagraphComponent;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  examForm: FormGroup;
  pageIndex: number = 1;
  activePage: string =
    'flex items-center justify-center px-4 h-10 w-12 text-white rounded-md page-active';
  regularPage: string =
    'flex items-center justify-center px-4 h-10 leading-tight text-white hover:text-white w-12 rounded-md page-back';
  arr: number[] = [];
  answers: string[] = [];
  isFill: boolean = false;
  exam: any;
  questionText: string = '';
  imageUrl: string = '';
  solution: string = '';

  timeLeft: number = 5400;
  timerInterval: any;

  isExamEnded: boolean = false;
  isAdmin: boolean = false;
  attempt: any;
  isReview: boolean = false;
  isVisible: boolean = false;
  warningVisible: boolean = false;
  answerString: string = ''

  fillTypeKeyControlsList: { key: string; control: FormControl }[] = [];

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
    this.imageUrl = this.exam.questions[0].imageUrl;
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
    this.updateFillTypeKeyControls()
    this.isAdmin = true;
    this.isExamEnded = true;
  }

  studentStart() {
    if (this.attempt === null) {
      this.populateQuestions(false);
      this.updateFillTypeKeyControls()
      this.startTimer();
    } else {
      this.isReview = true;
      this.isExamEnded = true;
      this.populateQuestions(true);
      this.updateFillTypeKeyControls()
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
    this.questions.controls.forEach((questionGroup: AbstractControl) => {
      const group = questionGroup as FormGroup;
      const fillGroup = group.get('fillTypeKeys') as FormGroup;

      if (fillGroup && fillGroup.controls) {
        const fillValues = Object.entries(fillGroup.controls).map(([key, control]) => {
          const value = control.value ?? '';
          return `${key}=${value}`;
        }).join(';');

        group.get('selectedAnswer')?.setValue(fillValues);
      }
    });
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
    this.imageUrl = this.exam.questions[this.pageIndex - 1].imageUrl;
    this.answers = this.exam.questions[this.pageIndex - 1].choices;
    this.isFill = this.exam.questions[this.pageIndex - 1].answerType === 'fill';
    this.updateFillTypeKeyControls()
  }

  onNextClick() {
    if (this.pageIndex != this.exam.questions.length) {
      this.pageIndex++;
      this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
      this.imageUrl = this.exam.questions[this.pageIndex - 1].imageUrl;
      this.answers = this.exam.questions[this.pageIndex - 1].choices;
      this.isFill = this.exam.questions[this.pageIndex - 1].answerType === 'fill';
      this.updateFillTypeKeyControls()
    }
  }

  onPreviousClick() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
      this.imageUrl = this.exam.questions[this.pageIndex - 1].imageUrl;
      this.answers = this.exam.questions[this.pageIndex - 1].choices;
      this.isFill = this.exam.questions[this.pageIndex - 1].answerType === 'fill';
      this.updateFillTypeKeyControls()
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
            selectedAnswer: [{ value: responseQuestion.selectedAnswer, disabled: true }, Validators.required],
            correctAnswer: { value: responseQuestion.question.correctAnswer.replace(/&\d/g, ''), disabled: true },
            _id: [questionData._id, Validators.required],
            imageUrl: [questionData.imageUrl],
            isCorrect: responseQuestion.isCorrect,
            solution: responseQuestion.question.solution,
            fillTypeKeys: this.getFillTypeKeyFormGroupWithResult(responseQuestion)
          })
        );
      });
    } else {
      this.exam.questions.forEach((questionData: any, index: number) => {
        this.questions.push(
          this.fb.group({
            selectedAnswer: [null],
            _id: [questionData._id],
            answerType: [questionData.answerType],
            imageUrl: [questionData.imageUrl],
            fillTypeKeys: this.getFillTypeKeyFormGroup(questionData.fillTypeKeys)
          })
        );
      });
    }
  }

  getFillTypeKeyFormGroup(fillTypeKeys: any[]): FormGroup | null {
    if (fillTypeKeys.length > 0) {
      const fillTypeKeyFormGroup = this.fb.group({})
      fillTypeKeys.forEach(key => {
        fillTypeKeyFormGroup.addControl(key, this.fb.control(''))
      })
      return fillTypeKeyFormGroup
    } else {
      return null
    }
  }

  getFillTypeKeyFormGroupWithResult(questionRes: any): FormGroup | null {
    if (
      questionRes.question.answerType !== 'fill' ||
      !Array.isArray(questionRes.question.fillTypeKeys)
    ) {
      return null;
    }

    const group = this.fb.group({});

    // Parse selected answers (e.g., "A=1;B=2")
    const selectedMap: Record<string, string> = {};
    if (questionRes.selectedAnswer) {
      questionRes.selectedAnswer.split(';').forEach((pair: string) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          selectedMap[key.trim()] = value.trim();
        }
      });
    }

    // Parse correct answers (e.g., "A=1&1;B=2&1") → extract just the value before &
    const correctMap: Record<string, string> = {};
    if (questionRes.question.correctAnswer) {
      questionRes.question.correctAnswer.split(';').forEach((pair: string) => {
        const [key, valueWithMeta] = pair.split('=');
        if (key && valueWithMeta) {
          const value = valueWithMeta.split('&')[0];
          correctMap[key.trim()] = value.trim();
        }
      });
    }

    // Create disabled controls with visual correctness checking
    questionRes.question.fillTypeKeys.forEach((key: string) => {
      const selected = selectedMap[key] || '';
      const correct = correctMap[key] || '';

      const control = this.fb.control(
        { value: selected, disabled: true },
        Validators.required
      );

      if (selected === correct) {
        control.setErrors({ correct: true });
      } else {
        control.setErrors({ incorrect: true });
      }

      group.addControl(key, control);
    });

    return group;
  }

  updateFillTypeKeyControls() {
    const formGroup = this.questions.at(this.pageIndex - 1) as FormGroup;
    const group = formGroup.get('fillTypeKeys') as FormGroup;

    if (group && group.controls) {
      this.fillTypeKeyControlsList = Object.entries(group.controls)
        .map(([key, control]) => (
          {
            key,
            control: control as FormControl
          }
        ));
    } else {
      this.fillTypeKeyControlsList = [];
    }
  }

  getCheck(answer: any): any {
    const responses = this.attempt.responses as any[];
    const isCheck = responses.find(res => res.question._id === this.exam.questions[this.pageIndex - 1]['_id']).question.correctAnswer === answer;
    return isCheck
  }

  onAnswerClick() {
    const responses = this.attempt.responses as any[];
    this.answerString = 'Бодолт байхгүй.'
    const qstn = responses.find(res => res.question._id === this.exam.questions[this.pageIndex - 1]['_id'])
    if (qstn) {
      this.answerString = qstn.question.solution ?? 'Бодолт байхгүй.';
    }
    this.isVisible = true;
  }

  finishExam() {
    if (this.isReview || this.authService.getUserRole() !== 'student') {
      this.router.navigate(['/home']);
      return;
    };
    this.warningVisible = true
  }



  isSidebarOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  rerenderMathjax() {
    setTimeout(() => {
      this.solutionMath.renderMath();
    }, 0);
  }

  getSolutionImageUrl(): string {
    if (!this.isReview) {
      return '';
    }
    const responses = this.attempt.responses as any[];
    const qstn = responses.find(res => res.question._id === this.exam.questions[this.pageIndex - 1]['_id'])
    return qstn.question.solutionImageUrl;
  }
}
