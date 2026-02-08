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

  ngOnChanges() {
    this.isLoading = true;
    this.userId = this.userIdInput;
    this.loadAll();
  }

  loadAll() {
    this.api.categories(this.userId).subscribe((d: any) => {
      this.categories = d;
      this.categoryChart = this.buildCategoryChart(d);

      this.categoryChart.datasets[0].backgroundColor =
        this.categoryChart.datasets[0].data.map((_: any, i: any) =>
          i === 0 ? '#27567c' : '#4dabf7'
        );
      this.categoryChart.datasets[1].backgroundColor =
        this.categoryChart.datasets[1].data.map((_: any, i: any) =>
          i === 0 ? '#803636' : '#ff6b6b'
        );

      this.loadSubCategories(d[0]?.category);
      this.loadSummaryByCategory(d[0]?.category);
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
      this.categories = d;
      this.categoryChart = this.buildCategoryChart(d);

      this.categoryChart.datasets[0].backgroundColor =
        this.categoryChart.datasets[0].data.map((_: any, i: any) =>
          i === 0 ? '#27567c' : '#4dabf7'
        );
      this.categoryChart.datasets[1].backgroundColor =
        this.categoryChart.datasets[1].data.map((_: any, i: any) =>
          i === 0 ? '#803636' : '#ff6b6b'
        );

      this.loadSubCategories(d[0]?.category);
      this.loadSummaryByCategory(d[0]?.category);
    });
  }

  load5B() {
    this.api.categories5Var(this.userId, 'B').subscribe((d: any) => {
      this.categories = d;
      this.categoryChart = this.buildCategoryChart(d);

      this.categoryChart.datasets[0].backgroundColor =
        this.categoryChart.datasets[0].data.map((_: any, i: any) =>
          i === 0 ? '#27567c' : '#4dabf7'
        );
      this.categoryChart.datasets[1].backgroundColor =
        this.categoryChart.datasets[1].data.map((_: any, i: any) =>
          i === 0 ? '#803636' : '#ff6b6b'
        );

      this.loadSubCategories(d[0]?.category);
      this.loadSummaryByCategory(d[0]?.category);
    });
  }

  buildCategoryChart(data: any[]) {
    return {
      labels: data.map(x => x.category),
      datasets: [
        {
          label: 'Зөв',
          data: data.map(x => x.percentage),
          backgroundColor: [
            '#4dabf7'
          ]
        },
        {
          label: 'Буруу',
          data: data.map(x => (100 - x.percentage)),
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
        this.subCategories = data.sort((a: any, b: any) => {
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