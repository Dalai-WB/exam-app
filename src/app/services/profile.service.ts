import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userState: UserStateService) {}

  getUserProfile() {
    return this.userState.uid$.pipe(
      switchMap(uid => this.http.get(`${this.baseUrl}user/profile/${uid}`))
    );
  }

  updateUserProfile(body: any) {
    return this.userState.uid$.pipe(
      switchMap(uid => this.http.put(`${this.baseUrl}user/profile/${uid}`, body))
    );
  }
}
