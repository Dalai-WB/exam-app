import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPendingRequests() {
    return this.http.get(`${this.baseUrl}user/status/pending`);
  }

  approveUser(userId: any) {
    return this.http.put(`${this.baseUrl}user/approve/${userId}`, {});
  }

  deleteUser(userId: string) {
    return this.http.delete<{ message: string; fireId: string }>(`${this.baseUrl}user/${userId}`, {});
  }
}
