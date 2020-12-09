import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() editTodo = new EventEmitter();
  @Output() createTodo = new EventEmitter();
  @Output() deleteTodo = new EventEmitter();
  @Output() markComplete = new EventEmitter();
  constructor() {}
}
