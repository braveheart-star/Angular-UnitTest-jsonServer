import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  mockTodos,
  MockTodoService,
} from 'src/app/mockServices/todo.mock-service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { TodoListComponent } from '../todo-list/todo-list.component';

import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoComponent, TodoListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: TodoService, useClass: MockTodoService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Fetched todos', () => {
    it('should have two todos', (done) => {
      component.todos$.subscribe((todos) => {
        expect(todos.length).toEqual(2);
        done();
      });
    });

    it('should have two todos with id 1,2', (done) => {
      component.todos$.subscribe((todos) => {
        expect(todos.map((todo) => todo.id)).toEqual([1, 2]);
        done();
      });
    });
  });

  describe('Delete todo', () => {
    it('should changed the property deleted to true of the passed todo', (done) => {
      component.deleteTodo(mockTodos[1]);
      component.todos$.subscribe((todos) => {
        expect(todos[1].deleted).toEqual(true);
        done();
      });
    });
  });

  describe('Mark Complete', () => {
    it('should change the status to done', ((done) => {
      component.markComplete(mockTodos[1]);
      component.todos$.subscribe((todos) => {
        expect(todos.find((todo) => todo.id === mockTodos[1].id)?.status).toEqual(
          'done'
        );
        done();
      });
    }));
  });

  describe('navigate', () => {
    beforeEach(() => {
      router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      fixture.detectChanges();
    });
    it('should route to single params in array', () => {
      component.navigate(['add']);
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should route to multiple params in array', () => {
      component.navigate(['add', 'test']);
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
