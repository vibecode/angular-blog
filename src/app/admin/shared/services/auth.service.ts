import { Injectable } from '@angular/core'
import { User, FbAuthResponse } from '../interfaces'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment as env } from 'environments/environment'

@Injectable()
export class AuthService {
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
      .pipe(tap(this.setToken))
  }

  logout() {
    this.setToken(null)
  }

  isLoggedIn(): boolean {
    return !!this.token
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
