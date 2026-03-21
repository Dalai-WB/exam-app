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
  selectedCategory: string = '';

  categoryChart: any;
  trendChart: any;

  categoryChartOptions = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.x}%`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: { callback: (v: any) => `${v}%` }
      },
      y: {
        stacked: true,
        ticks: {
          autoSkip: false,
          font: { size: 11 }
        },
        afterFit: (axis: any) => { axis.width = 200; }
      }
    }
  };

  trendChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: 'Оноо (%)' }
      },
      x: {
        title: { display: true, text: 'Сорилын дугаар' }
      }
    }
  };
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

  private processCategories(data: any[]) {
    this.categories = this.mergeWithHardcodedCategories(data);
    this.categoryChart = this.buildCategoryChart(this.categories);
    this.highlightBar(0);
    const firstCategory = this.categories[0]?.category || this.categories[0]?.title;
    this.selectedCategory = firstCategory;
    this.loadSubCategories(firstCategory);
    this.loadSummaryByCategory(firstCategory);
  }

  private highlightBar(index: number) {
    this.categoryChart.datasets[0].backgroundColor =
      this.categoryChart.datasets[0].data.map((_: any, i: any) =>
        i === index ? '#27567c' : '#4dabf7'
      );
    this.categoryChart.datasets[1].backgroundColor =
      this.categoryChart.datasets[1].data.map((_: any, i: any) =>
        i === index ? '#803636' : '#ff6b6b'
      );
  }

  loadAll() {
    this.api.categories(this.userId).subscribe((d: any) => {
      this.processCategories(d);
    });

    this.api.trend(this.userId).subscribe((d: any) => {
      this.trendA = d.A;
      this.trendB = d.B;
      this.trendChart = this.buildTrendChart();
    });
  }

  load5A() {
    this.api.categories5Var(this.userId, 'A').subscribe((d: any) => {
      this.processCategories(d);
    });
  }

  load5B() {
    this.api.categories5Var(this.userId, 'B').subscribe((d: any) => {
      this.processCategories(d);
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
    this.highlightBar(index);
    this.chart?.chart?.update();

    const label = this.categoryChart.labels[index];
    this.selectedCategory = label;
    this.loadSubCategories(label);
    this.loadSummaryByCategory(label);
  }

  loadSubCategories(category: string) {
    this.api.subCategoriesByCategory(this.userId, category)
      .subscribe((data: any) => {
        const hardcodedCategory = this.hardcodedCategories.find(
          cat => cat.title === category
        );
        const hardcodedSubCats = hardcodedCategory?.subCategories || [];

        // Build a lookup from backend results
        const backendMap = new Map(
          (data || []).map((s: any) => [s.subCategory, s])
        );

        // Always show all hardcoded subcategories; overlay backend data where available
        const mergedSubCats = hardcodedSubCats.map((h: any) => {
          const backendData: any = backendMap.get(h.title) || {};
          return {
            subCategory: h.title,
            percentage: 0,
            ...backendData,
          };
        });

        this.subCategories = mergedSubCats.sort((a: any, b: any) => {
          if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
          }
          return a.subCategory.localeCompare(b.subCategory);
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