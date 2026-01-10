// dashboard.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: any;

  userId = 'PUT_USER_ID_HERE';
  isLoading = false;
  defaultSelectedCategory = 'Комбинаторик';

  // filters
  period = 'ALL';
  examType = 'A';

  categories: any[] = [];
  subCategories: any[] = [];
  summary: any[] = [];
  trend: any[] = [];

  categoryChart: any;
  trendChart: any;
  filterOptions: any[] = [
    { label: 'БҮГД', value: 'all' },
    { label: 'СҮҮЛИЙН 5 СОРИЛ (А)', value: 'last5A' },
    { label: 'СҮҮЛИЙН 5 СОРИЛ (Б)', value: 'last5B' },
  ];
  filters: any = 'all';

  constructor(private api: DashboardService, private auth: Auth) { }

  ngOnInit() {
    this.isLoading = true;
    user(this.auth).subscribe((currentUser) => {
      if (currentUser?.uid) {
        this.userId = currentUser.uid;
        this.loadAll();
      }
    });
  }

  loadAll() {
    this.api.categories(this.userId).subscribe((d: any) => {
      this.categories = d;
      this.categoryChart = this.buildCategoryChart(d);

      this.categoryChart.datasets[0].backgroundColor =
        this.categoryChart.datasets[0].data.map((_: any, i: any) =>
          i === 0 ? '#ff6b6b' : '#4dabf7'
        );

      this.loadSubCategories(d[0]?.category);
    });

    this.api.summary(this.userId).subscribe((d: any) => this.summary = d);

    this.api.trend(this.userId).subscribe((d: any) => {
      this.trend = d;
      this.trendChart = this.buildTrendChart(d);
    });
  }

  buildCategoryChart(data: any[]) {
    return {
      labels: data.map(x => x.category),
      datasets: [{
        label: '%',
        data: data.map(x => x.percentage),
        backgroundColor: [
          '#4dabf7'
        ]
      }]
    };
  }

  buildTrendChart(data: any[]) {
    return {
      labels: data.map((_, i) => i + 1),
      datasets: [{
        label: 'Score %',
        data: data.map(x => x.score),
        tension: 0.4,
        fill: false
      }]
    };
  }

  onBarClick(event: any) {
    const index = event.element.index;

    this.categoryChart.datasets[0].backgroundColor =
      this.categoryChart.datasets[0].data.map((_: any, i: any) =>
        i === index ? '#ff6b6b' : '#4dabf7'
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

  onSelectFilter() {
    //TODO: implement filter logic
  }

}
