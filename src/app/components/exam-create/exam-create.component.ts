import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlState, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { MathJaxParagraphComponent } from '../math-jax-paragraph/math-jax-paragraph.component';

@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.scss']
})
export class ExamCreateComponent {
  @ViewChild('solutionMath') solutionMath!: MathJaxParagraphComponent;
  private baseUrl = environment.apiUrl;
  isLoading: boolean = false;
  isFinished: boolean = false;
  activeIndex: number = 0;
  examForm: FormGroup;
  isEditMode: boolean = false;
  examId: string | null = null;
  isVisible: boolean = false;

  categories: String[] = [
    'Тоон ба үсэгт илэрхийлэл',
    'Функц',
    'Тэгшитгэл ба тэнцэтгэл биш',
    'Дараалал',
    'Тригонометр',
    'Функцийн уламжлал',
    'Интеграл',
    'Координатын систем',
    'Вектор',
    'Хавтгайн геометр',
    'Огторгуйн геометр',
    'Магадлал статистик',
    'Комплекс тоо',
    'Матриц'
  ]
  answerTypes: any[] = [
    { label: 'Тест', value: 'test' },
    { label: 'Нөхөх хэсэг', value: 'fill' },
  ]

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private msg: MessageService,
    private route: ActivatedRoute,
  ) {
    this.examForm = this.fb.group({
      examName: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // Check if the route contains an ID
    this.route.paramMap.subscribe(params => {
      this.examId = params.get('id');
      this.isEditMode = !!this.examId;

      if (this.isEditMode) {
        this.loadExamDetails(this.examId!);
      }
    });
  }

  loadExamDetails(id: string): void {
    const apiUrl = `${this.baseUrl}exam/admin/${id}`; // Update with your endpoint
    this.http.get<any>(apiUrl).subscribe({
      next: (exam) => {
        // Patch form with exam details
        this.examForm.patchValue({
          examName: exam.examName,
          duration: exam.duration,
          totalPoint: exam.totalPoint,
        });

        // Add questions to the form
        exam.questions.forEach((question: any) => {
          const questionGroup = this.createQuestion();
          questionGroup.patchValue({
            _id: question._id,
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            category: question.category,
            answerType: question.answerType,
            questionPoint: question.questionPoint,
            solution: question.solution,
            imageUrl: question.imageUrl,
            imageKey: question.imageKey,
            fillTypeKeys: question.fillTypeKeys,
          });

          // Add choices
          const choicesArray = questionGroup.get('choices') as FormArray;
          question.choices.forEach((choice: string) => {
            choicesArray.push(this.fb.control(choice, Validators.required));
          });

          if (question.answerType === 'fill' && question.correctAnswer) {
            const fillTestAnswersArray = questionGroup.get('fillTestAnswers') as FormArray;

            const parsedAnswers = question.correctAnswer.split(';').map((entry: string) => {
              const [labelPart, rest] = entry.split('=');
              const [answer, point] = rest.split('&');
              return { label: labelPart, answer, point };
            });

            parsedAnswers.forEach((parsed:any) => {
              fillTestAnswersArray.push(
                this.fb.group({
                  label: [parsed.label],
                  answer: [parsed.answer],
                  point: [parsed.point]
                })
              );
            });
          }

          this.questions.push(questionGroup);
        });
      },
      error: (error) => {
        console.error('Error loading exam details:', error);
        this.msg.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Шалгалтын мэдээллийг унших үед алдаа гарлаа',
        });
      }
    });
  }

  // Getter for questions FormArray
  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  getChoices(question: any): FormArray {
    return question.get('choices') as FormArray;
  }

  getQuestionText(index: any): FormControl {
    return this.questions.at(index).get('questionText') as FormControl
  }

  getQuestionSolution(index: any): FormControl {
    return this.questions.at(index).get('solution') as FormControl
  }

  getQuestion(index: any): FormGroup {
    return this.questions.at(index) as FormGroup
  }

  getAnswerType(index: any): FormControl {
    return this.questions.at(index).get('answerType') as FormControl
  }

  getQuestionImageUrl(index: any): String {
    const imageUrl = this.questions.at(index).get('imageUrl') as FormControl;
    return imageUrl.value
  }

  onAnswerTypeChange(event: DropdownChangeEvent, index: number) {
    if (event.value === 'fill') {
      const formArray = this.questions.at(index).get('choices') as FormArray
      formArray.clear();
    }
  }

  // Create a new question form group
  createQuestion(): FormGroup {
    return this.fb.group({
      _id: null,
      questionText: ['', Validators.required],
      choices: this.isEditMode
        ? this.fb.array([])
        : this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required),
        ]),
      correctAnswer: ['', Validators.required],
      category: ['', Validators.required],
      answerType: ['', Validators.required],
      questionPoint: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      solution: [''],
      imageUrl: [''],
      imageKey: [''],
      fillTypeKeys: this.fb.array([]),
      fillTestAnswers: this.fb.array([])
    });
  }

  // Add a new question
  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  // Remove a question
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  // Add a choice to a specific question
  addChoice(questionIndex: number): void {
    const choices = this.questions.at(questionIndex).get('choices') as FormArray;
    choices.push(this.fb.control('', Validators.required));
  }

  // Remove a choice from a specific question
  removeChoice(questionIndex: number, choiceIndex: number): void {
    const choices = this.questions.at(questionIndex).get('choices') as FormArray;
    choices.removeAt(choiceIndex);
  }

  // Submit the form
  submit(): void {
    this.isLoading = true;
    const questionsFormArray = this.examForm.get('questions') as FormArray;

    questionsFormArray.controls.forEach((questionGroup: AbstractControl) => {
      const answerType = questionGroup.get('answerType')?.value;

      if (answerType === 'fill') {
        const fillTestAnswers = questionGroup.get('fillTestAnswers')?.value || [];

        const correctAnswerString = fillTestAnswers
          .map((choice: any) => `${choice.label}=${choice.answer}&${choice.point}`)
          .join(';');
        const fillTypeKeys = fillTestAnswers
          .map((choice: any) => choice.label)

        questionGroup.get('correctAnswer')?.setValue(correctAnswerString);
        const fillTypeKeyArray = questionGroup.get('fillTypeKeys') as FormArray
        fillTypeKeys.forEach((key: any) =>
          fillTypeKeyArray.push(new FormControl(key))
        );
      }
    });
    if (this.examForm.valid) {
      this.isFinished = true;
      // Send form data to the backend
      const apiUrl = this.isEditMode
        ? `${this.baseUrl}exam/update/${this.examId}` // Update endpoint
        : `${this.baseUrl}exam/create`; // Create endpoint
      this.http.post(apiUrl, this.examForm.value).subscribe({
        next: (response) => {
          console.log('Exam created successfully', response);
          this.isLoading = false;
          this.msg.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгаллаа',
          });
          this.router.navigate(['home']);
        },
        error: (error) => {
          console.error('Error creating exam', error);
          this.isLoading = false;
          this.msg.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Хадгалах үед алдаа гарлаа',
          });
        },
      });
    } else {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Бүх талбарыг бөглөнө үү',
      });
      Object.keys(this.examForm.controls).forEach(control => {
        this.examForm.controls[control].markAsDirty();
        this.examForm.controls[control].markAllAsTouched();
      })
      for (let control of this.questions.controls) {
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(key => {
            control.get(key)?.markAllAsTouched();
            control.get(key)?.markAsDirty();
          })
        } else {
          control.markAllAsTouched();
          control.markAsDirty();
        }
      }
      this.examForm.markAsDirty();
      console.error('Form is invalid');
    }
  }

  activeIndexChange(event: any) {
    // console.log(event);
    this.activeIndex = event ?? this.activeIndex;
  }

  onAnswerClick() {
    this.isVisible = true
  }

  getFillTestAnswers(question: any): FormArray {
    return question.get('fillTestAnswers') as FormArray;
  }

  addFillTestAnswer(questionIndex: number): void {
    const fillTestAnswer = this.questions.at(questionIndex).get('fillTestAnswers') as FormArray;
    fillTestAnswer.push(this.fb.group({
      label: ['', Validators.required],
      answer: ['', Validators.required],
      point: ['', Validators.required],
    }))
  }

  removeFillTestAnswer(questionIndex: number, choiceIndex: number): void {
    const answers = this.questions.at(questionIndex).get('fillTestAnswers') as FormArray;
    answers.removeAt(choiceIndex);
  }

  rerenderMathjax() {
    setTimeout(() => {
      this.solutionMath.renderMath();
    }, 0);
  }

  onImageUpload(event: any, index: number) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`${this.baseUrl}upload`, formData).subscribe((res: any) => {
      // Save S3 URL for question
      const fc = this.questions.at(index).get('imageKey') as FormControl;
      fc.setValue(res.key);
    });
  }
}
