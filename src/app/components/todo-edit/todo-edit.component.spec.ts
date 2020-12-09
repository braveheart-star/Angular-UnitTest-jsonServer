import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { TodoCreateFormComponent } from '../todo-create-form/todo-create-form.component';
import { RouterTestingModule } from '@angular/router/testing';

import { TodoEditComponent } from './todo-edit.component';
import { Todo } from 'src/app/models/todo.model';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from 'src/app/services/todo/todo.service';
import { MockTodoService } from 'src/app/mockServices/todo.mock-service';
import { ReactiveFormsModule } from '@angular/forms';

describe('TodoEditComponent', () => {
  let component: TodoEditComponent;
  let fixture: ComponentFixture<TodoEditComponent>;
  let todoService: MockTodoService;
  const baseTime = new Date(2013, 9, 23);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoEditComponent, TodoCreateFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: TodoService, useClass: MockTodoService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 2 } } },
        },
      ],
    }).compileComponents();
    todoService = (TestBed.inject(TodoService) as unknown) as MockTodoService;
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(baseTime);
    fixture = TestBed.createComponent(TodoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.todoForm.get('edited')?.value).toEqual(
      baseTime.toISOString()
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Todo form', () => {
    it('should be invalid when empty', () => {
      component.todoForm.reset();
      expect(component.todoForm.valid).toBeFalsy();
    });

    it('should be valid before editing', () => {
      expect(component.todoForm.valid).toBeTruthy();
    });

    it('should be invalid if title is empty', () => {
      component.todoForm.get('title')?.setValue('');
      expect(component.todoForm.valid).toBeFalsy();
    });

    it('should be invalid if owner is empty', () => {
      component.todoForm.get('owner')?.setValue('');
      expect(component.todoForm.valid).toBeFalsy();
    });
  });

  describe('Edit Todo', () => {
    it('should not call service if form is invalid', fakeAsync(() => {
      spyOn(todoService, 'editTodo');
      component.todoForm.get('owner')?.setValue('');
      component.updateTodo();
      tick();
      expect(todoService.editTodo).not.toHaveBeenCalled();
    }));

    it('should change the title in service if title is changed', fakeAsync(() => {
      component.todoForm.get('title')?.setValue('This is new task');
      component.updateTodo();
      tick();
      todoService.todos$.subscribe((todos: Todo[]) => {
        expect(todos.find((todo) => todo.id === 2)?.title).toEqual(
          'This is new task'
        );
      });
    }));

    it('should change the body in service if body is changed', fakeAsync(() => {
      component.todoForm.get('body')?.setValue('This is my new body');
      component.updateTodo();
      tick();
      todoService.todos$.subscribe((todos: Todo[]) => {
        console.dir(todos.find((todo) => todo.id === 2));
        expect(todos.find((todo) => todo.id === 2)?.body).toEqual(
          'This is my new body'
        );
      });
    }));
    it('should return a success message', fakeAsync(() => {
      component.todoForm.get('body')?.setValue('This is my big body');
      component.updateTodo();
      tick();
      component.todoMsg.subscribe((msg) => {
        expect(msg).toEqual('Todo Successfully updated');
      });
      tick();
    }));
  });
});
