import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  todos$: Observable<Todo[]> = this.todoService.todos$;
  constructor(private todoService: TodoService, private router: Router) {}

  deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo({ ...todo, deleted: true }).subscribe();
  }

  navigate(params: Array<string>): void {
    this.router.navigate(params);
  }

  markComplete(todo: Todo): void {

    this.todoService.editTodo({ ...todo, status: 'done' }).subscribe();
  }
}
