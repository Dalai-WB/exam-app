import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTeachers() {
    return this.http.get(`${this.baseUrl}user/teacher/all`);
  }
}
