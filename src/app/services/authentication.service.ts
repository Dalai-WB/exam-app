import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { MessageService } from 'primeng/api';
import { catchError, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private baseUrl = environment.apiUrl;
  currentUser: User | null = null;
  signedUser: UserCredential | null = null;
  userRole: string | null = null;

  constructor(
    private auth: Auth,
    private msg: MessageService,
    private http: HttpClient,
  ) { }

  createUser(params: SignIn, role: string, teacherId: String, firstName: String, lastName: String): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, params.email, params.password)
    ).pipe(
      switchMap((userCredential) => {
        this.userRole = role;
        localStorage.setItem('userRole', this.userRole);
        const fireId = userCredential.user.uid;
        this.signedUser = userCredential;

        // Send user data to the backend
        return this.http.post(`${this.baseUrl}user/register`, {
          username: params.email,
          firstName: firstName,
          lastName: lastName,
          role: role,
          fireId: fireId,
          teacherId: teacherId,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).pipe(
          catchError((error) => {
            this.userRole = null;
            localStorage.removeItem('userRole');
            userCredential.user.delete().catch((deleteError) => {
              console.error('Error deleting user from Firebase', deleteError);
            });

            this.msg.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Failed to save user data in database. User registration was rolled back.',
            });

            return throwError(() => new Error('Backend operation failed. User deleted from Firebase.'));
          })
        );
      }),
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  signIn(params: SignIn): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.auth, params.email, params.password)
    ).pipe(
      switchMap((userCredential) => {
        const fireId = userCredential.user.uid;
        this.signedUser = userCredential;
        return this.http.get(`${this.baseUrl}user/role-status/${fireId}`).pipe(
          tap((response: any) => {
            this.userRole = response.role;
            if (this.userRole) {
              localStorage.setItem('userRole', this.userRole);
            }
            if (response.firstName) {
              localStorage.setItem('firstName', response.firstName);
            }
            if (response.status) {
              localStorage.setItem('userStatus', response.status);
            }
          }),
          catchError((error) => {
            this.msg.add({
              severity: 'error',
              summary: 'Алдаа',
              detail: 'Failed to retrieve user information from the backend.',
            });
            return throwError(() => new Error(error));
          })
        );
      }),
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  logOut(): Observable<any> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUser = null;
        this.userRole = null;
        this.signedUser = null;
        localStorage.removeItem('userRole');
        localStorage.removeItem('firstName');
        localStorage.removeItem('userStatus');
      }),
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  authState(): Observable<any> {
    return from(this.auth.authStateReady()).pipe(
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  recoverPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError((error: FirebaseError) =>
        throwError(() => {
          this.msg.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: this.translateFirebaseErrorMessage(error),
          });
          new Error(this.translateFirebaseErrorMessage(error))
        })
      )
    );
  }

  private translateFirebaseErrorMessage({ code, message }: FirebaseError) {
    if (code === 'auth/invalid-email') {
      return 'Зөв и-мэйл оруулна уу!'
    }
    if (code === 'auth/invalid-credential') {
      return 'И-мэйл эсвэл нууц үг буруу байна.'
    }
    if (code === 'auth/user-not-found') {
      return 'User not found.';
    }
    if (code === 'auth/wrong-password') {
      return 'User not found.';
    }
    return message;
  }

  isLoggedIn(): Observable<boolean> {
    return authState(this.auth).pipe(map((user) => !!user));
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserStatus(): string | null {
    return localStorage.getItem('userStatus');
  }

  getUserFirstName(): string | null {
    return localStorage.getItem('firstName');
  }
}

type SignIn = {
  email: string;
  password: string;
};

type FirebaseError = {
  code: string;
  message: string;
};
