// src/app/services/dashboard.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private BASE = environment.apiUrl + 'dashboard';

  constructor(private http: HttpClient) {}

  categories(userId: string) {
    return this.http.get<any[]>(`${this.BASE}/${userId}/categories`);
  }

  subCategories(userId: string) {
    return this.http.get<any[]>(`${this.BASE}/${userId}/subcategories`);
  }

  summary(userId: string) {
    return this.http.get<any[]>(`${this.BASE}/${userId}/summary`);
  }

  trend(userId: string) {
    return this.http.get<any[]>(`${this.BASE}/${userId}/trend`);
  }

  subCategoriesByCategory(userId: string, category: string) {
    return this.http.get<any[]>(
      `${this.BASE}/${userId}/subcategories`,
      { params: { category } }
    );
  }
}
