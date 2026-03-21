import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, take } from 'rxjs';

export type UserRole = 'admin' | 'student';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface UserProfile {
  uid: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private readonly _profile$ = new BehaviorSubject<UserProfile | null>(null);

  readonly profile$: Observable<UserProfile | null> = this._profile$.asObservable();

  readonly role$: Observable<UserRole | null> = this._profile$.pipe(
    map(p => p?.role ?? null)
  );

  readonly status$: Observable<UserStatus | null> = this._profile$.pipe(
    map(p => p?.status ?? null)
  );

  readonly uid$: Observable<string> = this._profile$.pipe(
    filter((p): p is UserProfile => p !== null),
    map(p => p.uid),
    take(1)
  );

  get snapshot(): UserProfile | null {
    return this._profile$.getValue();
  }

  setProfile(profile: UserProfile): void {
    this._profile$.next(profile);
  }

  patch(partial: Partial<Pick<UserProfile, 'firstName'>>): void {
    const current = this._profile$.getValue();
    if (current) {
      this._profile$.next({ ...current, ...partial });
    }
  }

  clearProfile(): void {
    this._profile$.next(null);
  }
}
