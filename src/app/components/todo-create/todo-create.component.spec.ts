import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TodoCreateComponent } from './todo-create.component';
import { TodoCreateFormComponent } from '../todo-create-form/todo-create-form.component';
import { TodoService } from 'src/app/services/todo/todo.service';
import { MockTodoService } from 'src/app/mockServices/todo.mock-service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Todo } from 'src/app/models/todo.model';

describe('TodoCreateComponent', () => {
  let component: TodoCreateComponent;
  let fixture: ComponentFixture<TodoCreateComponent>;
  const newTodo: Todo = {
    title: 'Bring Sugar',
    body: 'Need a pound of sugar for tea and cake',
    media: '',
    status: 'todo',
    created: '',
    edited: '',
    deleted: false,
    owner: 'ajit',
  };
  const setFormValue = (formGroup: FormGroup): void => {
    formGroup.setValue(newTodo);
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoCreateComponent, TodoCreateFormComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [{ provide: TodoService, useClass: MockTodoService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Todo form', () => {
    it('should be invalid when empty', () => {
      expect(component.todoForm.valid).toBeFalsy();
    });

    it('should be valid if all fields are filled', () => {
      setFormValue(component.todoForm);
      expect(component.todoForm.valid).toBeTruthy();
    });

    it('should be invalid if title is empty', () => {
      setFormValue(component.todoForm);
      component.todoForm.get('title')?.setValue('');
      expect(component.todoForm.valid).toBeFalsy();
    });

    it('should be invalid if owner is empty', () => {
      setFormValue(component.todoForm);
      component.todoForm.get('owner')?.setValue('');
      expect(component.todoForm.valid).toBeFalsy();
    });
  });

  describe('Add todo', () => {
    it('should not call service if form is invalid', fakeAsync(() => {
      const todoService = TestBed.inject(TodoService);
      spyOn(todoService, 'addTodo');
      component.addTodo();
      tick();
      expect(todoService.addTodo).not.toHaveBeenCalled();
    }));

    it('should add add a length to todoSubject', fakeAsync(() => {
      const todoService = TestBed.inject(TodoService);
      setFormValue(component.todoForm);
      component.addTodo();
      tick();
      todoService.todos$.subscribe((todos: Todo[]) => {
        expect(todos.length).toEqual(3);
      });
    }));

    it('should add todo to the end of todoSubject value', fakeAsync(() => {
      const todoService = TestBed.inject(TodoService);
      setFormValue(component.todoForm);
      component.addTodo();
      tick();
      todoService.todos$.subscribe((todos: Todo[]) => {
        expect(todos[2]).toEqual(newTodo);
      });
    }));

    it('should return a success message', fakeAsync(() => {
      setFormValue(component.todoForm);
      component.addTodo();
      component.todoMsg.subscribe((msg) => {
        expect(msg).toEqual('Todo Success fully added');
      });
      tick();
    }));
  });
});
