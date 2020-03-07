import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Post } from '../shared/interfaces'
import { PostService } from '../shared/services/post.service'

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {
  form: FormGroup

  constructor(private postsService: PostService) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required)
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    const { title, author, text } = this.form.value

    const post: Post = {
      title,
      author,
      text,
      date: new Date()
    }

    this.postsService.create(post).subscribe(() => {
      this.form.reset()
    })
  }
}
