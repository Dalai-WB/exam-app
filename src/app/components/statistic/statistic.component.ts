import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { StatisticService } from '../../services/statistic.service';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  statistic: any[] = [];
  lastThreeStatistic: any[] = [];
  students: any[] = [];
  isTeacher: boolean = false;
  basicData: any;
  basicOptions: any;
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
  ];

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthenticationService, private service: StatisticService) { }

  ngOnInit() {
    if (this.auth.getUserRole() === 'teacher') {
      this.isTeacher = true;
      this.students = this.activatedRoute.snapshot.data['statistic'];
    } else {
      this.statistic = this.activatedRoute.snapshot.data['statistic'].overallStatistics;
      this.lastThreeStatistic = this.activatedRoute.snapshot.data['statistic'].lastThreeStatistics;
    }
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--bluegray-800');
    const textColorSecondary = documentStyle.getPropertyValue('--bluegray-700');
    const surfaceBorder = documentStyle.getPropertyValue('--bluegray-100');

    this.basicData = {
      labels: this.statistic.map(stat => stat.category),
      datasets: [
        {
          label: 'Нийт',
          data: this.statistic.map(stat => stat.percentage),
          backgroundColor: ['rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgb(255, 159, 64)'],
          borderWidth: 1
        },
        {
          label: 'Сүүлийн 3 сар',
          data: this.lastThreeStatistic.map(stat => stat.percentage),
          backgroundColor: ['rgba(98, 98, 199, 0.2)'],
          borderColor: ['rgb(98, 98, 199)'],
          borderWidth: 1
        },
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  onStudentSelected(event: DropdownChangeEvent) {
    this.service.getStatisticById(event.value).subscribe(
      (response: any) => {
        this.statistic = response.overallStatistics;
        this.lastThreeStatistic = response.lastThreeStatistics;
        this.basicData = {
          labels: this.statistic.map(stat => stat.category),
          datasets: [
            {
              label: 'Нийт',
              data: this.statistic.map(stat => stat.percentage),
              backgroundColor: ['rgba(255, 159, 64, 0.2)'],
              borderColor: ['rgb(255, 159, 64)'],
              borderWidth: 1
            },
            {
              label: 'Сүүлийн 3 сар',
              data: this.lastThreeStatistic.map(stat => stat.percentage),
              backgroundColor: ['rgba(98, 98, 199, 0.2)'],
              borderColor: ['rgb(98, 98, 199)'],
              borderWidth: 1
            },
          ]
        };
      }
    )
  }
}
