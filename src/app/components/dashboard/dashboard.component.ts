// dashboard.component.ts
import { Component, Input, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild('chart') chart: any;
  @Input() userIdInput: string = '';

  userId = 'PUT_USER_ID_HERE';
  isLoading = false;
  defaultSelectedCategory = 'Комбинаторик';

  // filters
  period = 'ALL';
  examType = 'A';

  // Hardcoded categories
  hardcodedCategories: any[] = [
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

  categories: any[] = [];
  subCategories: any[] = [];
  summary: any = null;
  trendA: any[] = [];
  trendB: any[] = [];

  categoryChart: any;
  trendChart: any;
  filterOptions: any[] = [
    { label: 'БҮГД', value: 'all' },
    { label: 'СҮҮЛИЙН 5 СОРИЛ (А)', value: 'last5A' },
    { label: 'СҮҮЛИЙН 5 СОРИЛ (Б)', value: 'last5B' },
  ];
  filters: any = 'all';

  constructor(private api: DashboardService) { }

  /**
   * Merge backend categories with hardcoded categories
   * If backend category matches a hardcoded one, include backend data
   * Always include all hardcoded categories as reference
   */
  mergeWithHardcodedCategories(backendCategories: any[]): any[] {
    if (!backendCategories || backendCategories.length === 0) {
      return this.hardcodedCategories;
    }

    // Create a map from backend data for quick lookup
    const backendMap = new Map(
      backendCategories.map(cat => [cat.category || cat.title, cat])
    );

    // Merge: use backend data where available, add hardcoded reference data
    const merged = this.hardcodedCategories.map(hardcoded => {
      const backendData = backendMap.get(hardcoded.title);
      if (backendData) {
        // Merge backend stats with hardcoded structure
        return {
          ...backendData,
          category: hardcoded.title,
          title: hardcoded.title,
          subCategories: hardcoded.subCategories
        };
      }
      return hardcoded;
    });

    return merged;
  }

  ngOnChanges() {
    this.isLoading = true;
    this.userId = this.userIdInput;
    this.loadAll();
  }

  loadAll() {
    this.api.categories(this.userId).subscribe((d: any) => {
      // Merge backend data with hardcoded categories
      this.categories = this.mergeWithHardcodedCategories(d);
      this.categoryChart = this.buildCategoryChart(this.categories);

      this.categoryChart.datasets[0].backgroundColor =
        this.categoryChart.datasets[0].data.map((_: any, i: any) =>
          i === 0 ? '#27567c' : '#4dabf7'
        );
      this.categoryChart.datasets[1].backgroundColor =
        this.categoryChart.datasets[1].data.map((_: any, i: any) =>
          i === 0 ? '#803636' : '#ff6b6b'
        );

      this.loadSubCategories(this.categories[0]?.category || this.categories[0]?.title);
      this.loadSummaryByCategory(this.categories[0]?.category || this.categories[0]?.title);
    });

    // this.api.summary(this.userId).subscribe((d: any) => {
    //   const summary = d.reduce((acc: any, item: any) => {
    //     acc[item._id] = item.count;
    //     return acc;
    //   }, {});
    //   this.summary = summary
    // });

    this.api.trend(this.userId).subscribe((d: any) => {
      this.trendA = d.A;
      this.trendB = d.B;
      this.trendChart = this.buildTrendChart();
    });
  }

  load5A() {
    this.api.categories5Var(this.userId, 'A').subscribe((d: any) => {
      // Merge backend data with hardcoded categories
      this.categories = this.mergeWithHardcodedCategories(d);
      this.categoryChart = this.buildCategoryChart(this.categories);

      this.categoryChart.datasets[0].backgroundColor =
        this.categoryChart.datasets[0].data.map((_: any, i: any) =>
          i === 0 ? '#27567c' : '#4dabf7'
        );
      this.categoryChart.datasets[1].backgroundColor =
        this.categoryChart.datasets[1].data.map((_: any, i: any) =>
          i === 0 ? '#803636' : '#ff6b6b'
        );

      this.loadSubCategories(this.categories[0]?.category || this.categories[0]?.title);
      this.loadSummaryByCategory(this.categories[0]?.category || this.categories[0]?.title);
    });
  }

  load5B() {
    this.api.categories5Var(this.userId, 'B').subscribe((d: any) => {
      // Merge backend data with hardcoded categories
      this.categories = this.mergeWithHardcodedCategories(d);
      this.categoryChart = this.buildCategoryChart(this.categories);

      this.categoryChart.datasets[0].backgroundColor =
        this.categoryChart.datasets[0].data.map((_: any, i: any) =>
          i === 0 ? '#27567c' : '#4dabf7'
        );
      this.categoryChart.datasets[1].backgroundColor =
        this.categoryChart.datasets[1].data.map((_: any, i: any) =>
          i === 0 ? '#803636' : '#ff6b6b'
        );

      this.loadSubCategories(this.categories[0]?.category || this.categories[0]?.title);
      this.loadSummaryByCategory(this.categories[0]?.category || this.categories[0]?.title);
    });
  }

  buildCategoryChart(data: any[]) {
    return {
      labels: data.map(x => x.category || x.title),
      datasets: [
        {
          label: 'Зөв',
          data: data.map(x => x.percentage || 0),
          backgroundColor: [
            '#4dabf7'
          ]
        },
        {
          label: 'Буруу',
          data: data.map(x => (100 - (x.percentage || 0))),
          backgroundColor: [
            '#ff6b6b'
          ]
        },
      ]
    };
  }

  buildTrendChart() {
    const maxLength = Math.max(this.trendA?.length || 0, this.trendB?.length || 0);

    const labels = Array.from({ length: maxLength }, (_, i) => `${i + 1}`);

    return {
      labels,
      datasets: [
        {
          label: 'A',
          data: this.trendA?.map(x => x.score),
          tension: 0.4,
          fill: false
        },
        {
          label: 'B',
          data: this.trendB?.map(x => x.score),
          tension: 0.4,
          fill: false
        }
      ]
    };
  }

  onBarClick(event: any) {
    const index = event.element.index;

    this.categoryChart.datasets[0].backgroundColor =
      this.categoryChart.datasets[0].data.map((_: any, i: any) =>
        i === index ? '#27567c' : '#4dabf7'
      );      
    this.categoryChart.datasets[1].backgroundColor =
      this.categoryChart.datasets[1].data.map((_: any, i: any) =>
        i === index ? '#803636' : '#ff6b6b'
      );

    this.chart?.chart?.update();

    // index of bar
    const dataIndex = event.element.index;

    // dataset index (usually 0)
    const datasetIndex = event.element.datasetIndex;

    // label (CATEGORY NAME)
    const label = this.categoryChart.labels[dataIndex];

    // value (PERCENTAGE)
    const value = this.categoryChart.datasets[datasetIndex].data[dataIndex];

    console.log('Clicked bar:', {
      label,
      value,
      dataIndex,
      datasetIndex
    });

    // Example: load subcategories for this category
    this.loadSubCategories(label);
    this.loadSummaryByCategory(label);
  }

  loadSubCategories(category: string) {
    this.api.subCategoriesByCategory(this.userId, category)
      .subscribe((data: any) => {
        // Get hardcoded subcategories for reference
        const hardcodedCategory = this.hardcodedCategories.find(
          cat => cat.title === category
        );
        const hardcodedSubCats = hardcodedCategory?.subCategories || [];

        // Merge backend data with hardcoded structure
        const mergedSubCats = data.map((subCat: any) => {
          const hardcoded = hardcodedSubCats.find(
            (h: any) => h.title === subCat.subCategory
          );
          return {
            ...subCat,
            ...hardcoded
          };
        });

        this.subCategories = mergedSubCats.sort((a: any, b: any) => {
          if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage; // primary: percentage DESC
          }
          return a.subCategory.localeCompare(b.subCategory); // secondary: name ASC
        });
        this.isLoading = false;
      });
  }

  loadSummaryByCategory(category: string) {
    this.api.summaryByCategory(this.userId, category)
      .subscribe((data: any) => {
        this.summary = data
      });
  }

  onSelectFilter(event: any) {
    switch (this.filters) {
      case 'all':
        this.loadAll();  
        break;
      case 'last5A':
        this.load5A();
        break;
      case 'last5B':
        this.load5B();
        break;
    }
  }
}