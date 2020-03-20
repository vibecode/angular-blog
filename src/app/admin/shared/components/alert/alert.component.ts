import { Component, OnInit, Input } from '@angular/core'
import { AlertService } from '../../services/alert.sevice'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() delay = 5000

  public text: string
  public type = 'success'
  aSub: Subscription
  timeout: number

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.aSub = this.alertService.alert$.subscribe(alert => {
      this.text = alert.text
      this.type = alert.type

      this.timeout = window.setTimeout(() => {
        this.text = ''
      }, this.delay)
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.alertService.alert$.unsubscribe()
    }

    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
}
