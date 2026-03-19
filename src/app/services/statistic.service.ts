import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userState: UserStateService) {}

  getStatistic() {
    return this.userState.uid$.pipe(
      switchMap(uid => this.http.get(`${this.baseUrl}userExam/statistic/${uid}`))
    );
  }

  getStatisticById(fireId: String) {
    return this.http.get(`${this.baseUrl}userExam/statistic/${fireId}`);
  }

  getStudents() {
    return this.userState.uid$.pipe(
      switchMap(uid => this.http.get(`${this.baseUrl}user/students/${uid}`))
    );
  }
}
