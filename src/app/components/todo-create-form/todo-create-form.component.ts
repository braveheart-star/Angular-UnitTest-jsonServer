import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-todo-create-form',
  templateUrl: './todo-create-form.component.html',
  styleUrls: ['./todo-create-form.component.scss'],
})
export class TodoCreateFormComponent {
  @Input() todoForm!: FormGroup ;
  @Output() todo = new EventEmitter();

  constructor() {
  }
}
