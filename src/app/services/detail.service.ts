import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userState: UserStateService) {}

  getExamById(id: String) {
    return this.userState.uid$.pipe(
      switchMap(uid => this.http.get(`${this.baseUrl}exam/${id}/${uid}`))
    );
  }

  saveExamAttempt(id: String, body: any) {
    return this.http.post(`${this.baseUrl}userExam/attempt/${id}`, body);
  }
}
