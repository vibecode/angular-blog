import { Injectable } from '@angular/core'
import { User, FbAuthResponse } from '../interfaces'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, Subject, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { environment as env } from 'environments/environment'

@Injectable()
export class AuthService {
  public error$: Subject<string> = new Subject<string>()

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if (new Date() > expDate) {
      this.logout()
      return null
    }

    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true

    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.apiKey}
    `,
        user
      )
      .pipe(tap(this.setToken), catchError(this.handleError.bind(this)))
  }

  logout() {
    this.setToken(null)
  }

  isLoggedIn(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error

    console.log(message)
    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email не найден')
        break
    }

    return throwError(error)
  }

  private setToken(response: FbAuthResponse | null) {
    if (!response) {
      localStorage.clear()
      return
    }

    const expDate = new Date(
      new Date().getTime() + Number(response.expiresIn) * 1000
    )

    localStorage.setItem('fb-token', response.idToken)
    localStorage.setItem('fb-token-exp', expDate.toString())
  }
}
