import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { User } from '../shared/interfaces'
import { AuthService } from '../shared/services/auth.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  form: FormGroup
  submitted = false
  message: string

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['loginAgain']) {
        this.message = 'Please log in'
      }
    })
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }

    this.submitted = true

    const { email, password } = this.form.value

    const user: User = {
      email,
      password
    }

    this.auth.login(user).subscribe(
      () => {
        this.form.reset()
        this.router.navigate(['/admin', 'dashboard'])
        this.submitted = false
      },
      () => (this.submitted = false)
    )
  }
}
