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
  subCategories: any[] = [];

  categories: any[] = [
    {
      title: "Бодит тоо",
      subCategories: [
        { title: "Натурал ба бүхэл тоо" },
        { title: "Рационал тоо ба рационал тоон илэрхийлэл" },
        { title: "Тооны квадрат ба куб язгуур" },
        { title: "Тооны зэрэг" },
      ],
    },
    {
      title: "Алгебрийн илэрхийлэл",
      subCategories: [
        { title: "Илэрхийлэл" },
        { title: "Хялбар тэнцэтгэл биш" },
      ],
    },
    {
      title: "Өгүүлбэртэй бодлого",
      subCategories: [
        { title: "Тэгшитгэл зохиох бодлого" },
        { title: "Процентийн бодлого" },
        { title: "Хольц ба хайлшийн бодлого" },
        { title: "Ажлын бодлого" },
        { title: "Хөдөлгөөний бодлого" },
      ],
    },
    {
      title: "Функц",
      subCategories: [
        { title: "Функцийн үндсэн чанар, ангилал" },
        { title: "Функцийн график" },
      ],
    },
    {
      title: "Олон гишүүнт",
      subCategories: [
        { title: "Тодорхойлолт, үндсэн ойлголтууд" },
        { title: "Безугийн теорем, Рационал язгуурын теорем" },
        { title: "Рационал бутархайг задлах" },
        { title: "Виетийн теорем" },
      ],
    },
    {
      title: "Тэгшитгэл",
      subCategories: [
        { title: "Шугаман тэгшитгэл" },
        { title: "Квадрат тэгшитгэл" },
        { title: "Рационал тэгшитгэл" },
        { title: "Иррационал тэгшитгэл" },
        { title: "Илтгэгч тэгшитгэл" },
        { title: "Логарифм тэгшитгэл" },
        { title: "Тригонометр тэгшитгэл" },
      ],
    },
    {
      title: "Тэнцэтгэл биш",
      subCategories: [
        { title: "Шугаман тэнцэтгэл биш" },
        { title: "Квадрат тэнцэтгэл биш" },
        { title: "Рационал тэнцэтгэл биш" },
        { title: "Иррационал тэнцэтгэл биш" },
        { title: "Илтгэгч тэнцэтгэл биш" },
        { title: "Логарифм тэнцэтгэл биш" },
        { title: "Тригонометр тэнцэтгэл биш" },
      ],
    },
    {
      title: "Дараалал ба цуваа",
      subCategories: [
        { title: "Дарааллын ерөнхий чанар" },
        { title: "Прогресс" },
        { title: "Төгсгөлөг нийлбэр, Σ тэмдэглэгээ" },
        { title: "Рекуррент дараалал" },
        { title: "Цуваа" },
        { title: "Математик индукцийн зарчим" },
      ],
    },
    {
      title: "Комбинаторик",
      subCategories: [
        { title: "Бином" },
        { title: "Комбинаторик" },
      ],
    },
    {
      title: "Магадлал, статистик",
      subCategories: [
        { title: "Магадлал" },
        { title: "Статистик" },
      ],
    },
    {
      title: "Хавтгайн геометр",
      subCategories: [
        { title: "Гурвалжин" },
        { title: "Дөрвөн өнцөгт" },
        { title: "Олон өнцөгт" },
        { title: "Тойрог" },
      ],
    },
    {
      title: "Огторгуйн геометр",
      subCategories: [
        { title: "Пирамид" },
        { title: "Цилиндр" },
        { title: "Призм" },
        { title: "Бөмбөрцөг" },
        { title: "Конус" },
      ],
    },
    {
      title: "Координатын систем ба вектор",
      subCategories: [
        { title: "Цэгийн координат" },
        { title: "Вектор түүн дээрх үйлдлүүд" },
        { title: "Хавтгай дээрх шулуун ба тойргийн тэгшитгэл" },
        { title: "Хоёр векторын хоорондох өнцөг" },
        { title: "Огторгуй дахь шулууны тэгшитгэл" },
        { title: "Огторгуй дахь хавтгайн тэгшитгэл" },
      ],
    },
    {
      title: "Матриц",
      subCategories: [
        { title: "Матриц дээрх үйлдлүүд" },
        { title: "Матрицын тодорхойлогч ба урвуу" },
        { title: "Матрицан тэгшитгэл ба систем" },
        { title: "Геометр хувиргалт" },
      ],
    },
    {
      title: "Функцийн уламжлал",
      subCategories: [
        { title: "Функцийн уламжлал" },
        { title: "Уламжлалын хэрэглээ" },
      ],
    },
    {
      title: "Интеграл",
      subCategories: [
        { title: "Тодорхой биш интеграл" },
        { title: "Тодорхой интеграл" },
        { title: "Интегралын хэрэглээ" },
      ],
    },
    {
      title: "Дифференциал тэгшитгэл",
      subCategories: [
        { title: "Үндсэн ойлголт" },
        { title: "Хувьсагч нь ялгагдах тэгшитгэл" },
        { title: "Анхны нөхцөлтэй бодлого" },
      ],
    },
    {
      title: "Комплекс тоо",
      subCategories: [
        { title: "Комплекс тоо түүн дээрх үйлдлүүд" },
        { title: "Тэгшитгэл" },
      ],
    },
  ];

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
    this.isLoading = true;
    this.http.get<any>(apiUrl).subscribe({
      next: (exam) => {
        this.isLoading = false;
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
            subCategory: question.subCategory,
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

            parsedAnswers.forEach((parsed: any) => {
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
        const selectedCategory = this.questions.at(0)?.get('category')?.value;
        this.subCategories = this.categories.find(cat => cat.title === selectedCategory)?.subCategories || [];
      },
      error: (error) => {
        this.isLoading = false;
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
    if (this.questions.at(index)) {
      return this.questions.at(index).get('solution') as FormControl;
    }
    return new FormControl('');
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
      subCategory: ['', Validators.required],
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
      this.isLoading = false;
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
    const selectedCategory = this.questions.at(event)?.get('category')?.value;
    this.subCategories = this.categories.find(cat => cat.title === selectedCategory)?.subCategories || [];
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

  onDeleteImage(index: number) {
    if (!confirm('Тухайн зургийг устгах уу?')) return;

    const fc = this.questions.at(index).get('imageKey') as FormControl;
    fc.setValue(null);
    this.questions.at(index).get('imageUrl')?.setValue(null);
  }

  onCategoryChange(selectedCategory: any) {
    this.subCategories = this.categories.find(cat => cat.title === selectedCategory)?.subCategories || [];
    console.log('Subcategories:', this.subCategories);
    this.examForm.get('subCategory')?.reset();
  }
}
