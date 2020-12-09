import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TodoService } from 'src/app/services/todo/todo.service';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.scss'],
})
export class TodoEditComponent {
  todoForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    owner: new FormControl('', [Validators.required]),
    body: new FormControl(''),
    media: new FormControl(''),
    status: new FormControl('todo'),
    created: new FormControl(),
    edited: new FormControl(new Date().toISOString()),
    deleted: new FormControl(false),
  });
  todoMsg: Observable<undefined | string> = of(undefined);
  todo$ = this.todoService
    .getTodoID(Number(this.route.snapshot.params.id))
    .pipe(
      tap((todo) => {
        if (todo) {
          this.todoForm.get('title')?.setValue(todo.title);
          this.todoForm.get('owner')?.setValue(todo.owner);
          this.todoForm.get('body')?.setValue(todo.body);
          this.todoForm.get('media')?.setValue(todo.media);
          this.todoForm.get('status')?.setValue(todo.status);
          this.todoForm.get('created')?.setValue(todo.created);
        }
      })
    );
  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) {}

  updateTodo(): void {
    if (this.todoForm.valid) {
      this.todoMsg = this.todoService.editTodo({
        id: Number(this.route.snapshot.params.id),
        ...this.todoForm.value,
      });
    }
  }
}
