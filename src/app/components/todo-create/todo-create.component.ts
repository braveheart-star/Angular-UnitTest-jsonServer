import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { TodoService } from 'src/app/services/todo/todo.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
})
export class TodoCreateComponent {
  todoForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    owner: new FormControl('', [Validators.required]),
    body: new FormControl(''),
    media: new FormControl(''),
    status: new FormControl('todo'),
    created: new FormControl(new Date().toISOString()),
    edited: new FormControl(''),
    deleted: new FormControl(false),
  });
  todoMsg: Observable<undefined | string> = of(undefined);
  constructor(private todoService: TodoService) {}
  addTodo(): void {
    if (this.todoForm.valid) {
      this.todoMsg = this.todoService.addTodo(this.todoForm.value);
    }
  }
}
