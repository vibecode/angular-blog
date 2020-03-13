import { Component, OnInit, OnDestroy } from '@angular/core'
import { PostService } from '../shared/services/post.service'
import { Post } from '../shared/interfaces'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  pSub: Subscription
  dSub: Subscription
  searchStr: ''

  constructor(private postsService: PostService) {}

  ngOnInit(): void {
    this.dSub = this.pSub = this.postsService.getAll().subscribe(posts => {
      this.posts = posts
    })
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }

    if (this.dSub) {
      this.pSub.unsubscribe()
    }
  }

  remove(id: string) {
    this.postsService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id)
    })
  }
}
