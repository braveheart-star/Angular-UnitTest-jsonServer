import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from 'src/app/models/todo.model';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    todoService = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
    const request = httpMock.expectOne('todos');
    request.flush(mockTodos);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(todoService).toBeTruthy();
  });

  it('should make a request to the server in constructor ad add it to todosSubject$', () => {
    todoService.todos$.subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
    });
  });

  describe('getTodos', () => {
    it('should make a request to the server without subscribing', () => {
      todoService.getTodos();
      const request = httpMock.expectOne('todos');
      request.flush([mockTodos[1]]);
      todoService.todos$.subscribe((todos) => {
        expect(todos).toEqual([mockTodos[1]]);
      });
    });

    it('should not return a deleted todo', () => {
      todoService.getTodos();
      const request = httpMock.expectOne('todos');
      request.flush([{ ...mockTodos[1], deleted: true }]);
      todoService.todos$.subscribe((todos) => {
        expect(todos).toEqual([]);
      });
    });

    it('should add an error to todosSubject$ err', () => {
      todoService.getTodos();
      const request = httpMock.expectOne('todos');
      request.error(new ErrorEvent('500'));
      todoService.todos$.subscribe({
        error: (err) => {
          expect(err).toBeDefined();
        },
      });
    });
  });

  describe('getCurrentTodos', () => {
    it('should return the current todos in BehaviorSubject', () => {
      todoService.todos$.subscribe((todos) => {
        expect(todos).toEqual(todoService.getCurrentTodos());
      });
    });
  });

  describe('addTodo', () => {
    const todo: Todo = {
      title: 'Bring coke',
      body: 'For the party tonight',
      media: '',
      status: 'todo',
      created: '',
      edited: '',
      deleted: false,
      owner: 'ajit',
    };

    it('should add the new todo at the end', () => {
      todoService.addTodo(todo).subscribe((msg) => {
        expect(msg).toEqual('Todo Success fully added');
      });
      const request = httpMock.expectOne('todos');
      expect(request.request.method).toEqual('POST');
      request.flush({ ...todo, id: 3 });

      todoService.todos$.subscribe((todos) => {
        expect(todos[todos.length - 1]).toEqual({ ...todo, id: 3 });
      });
    });

    it('should make todoSubject to throw an error if error occurs', () => {
      todoService.addTodo(todo).subscribe({
        error: (err) => {
          expect(err).toBeDefined();
        },
      });
      const request = httpMock.expectOne('todos');
      expect(request.request.method).toEqual('POST');
      request.error(new ErrorEvent('500'));
      todoService.todos$.subscribe({
        error: (err) => {
          expect(err).toBeDefined();
        },
      });
    });
  });
  describe('editTodo', () => {
    it('should change the title if title is changed in the passed todo', () => {
      const mockTodo: Todo = { ...mockTodos[0], title: 'Bring Eggs' };
      todoService.editTodo(mockTodo).subscribe((msg) => {
        expect(msg).toEqual('Todo Successfully updated');
      });
      const request = httpMock.expectOne(`todos/${mockTodo.id}`);
      expect(request.request.method).toEqual('PUT');
      request.flush(mockTodo);

      todoService.todos$.subscribe((todos) => {
        expect(todos[0].title).toEqual('Bring Eggs');
      });
    });

    it('should change the body if body is changed in the passed todo', () => {
      const mockTodo: Todo = { ...mockTodos[0], body: 'This is my new body' };
      todoService.editTodo(mockTodo).subscribe((msg) => {
        expect(msg).toEqual('Todo Successfully updated');
      });
      const request = httpMock.expectOne(`todos/${mockTodo.id}`);
      expect(request.request.method).toEqual('PUT');
      request.flush(mockTodo);

      todoService.todos$.subscribe((todos) => {
        expect(todos[0].body).toEqual('This is my new body');
      });
    });

    it('should throw an err and todoSubject$ to throw an error if error occurs', () => {
      const mockTodo: Todo = { ...mockTodos[0], body: 'This is my new body' };
      todoService.editTodo(mockTodo).subscribe({
        error: (err) => {
          expect(err).toBeDefined();
        },
      });
      const request = httpMock.expectOne(`todos/${mockTodo.id}`);
      expect(request.request.method).toEqual('PUT');
      request.error(new ErrorEvent('500'));
      todoService.todos$.subscribe({
        error: (err) => {
          expect(err).toBeDefined();
        },
      });
    });
  });
  describe('deleteTodo', () => {
    it('should delete the todo in todoSubject$', () => {
      const mockTodo: Todo = { ...mockTodos[0], deleted: true };
      todoService.deleteTodo(mockTodo).subscribe();
      const request = httpMock.expectOne(`todos/${mockTodo.id}`);
      expect(request.request.method).toEqual('PUT');
      request.flush(mockTodo);
      const getTodos = httpMock.expectOne(`todos`);
      expect(getTodos.request.method).toEqual('GET');
      getTodos.flush([{ ...mockTodos[0], deleted: true }, { ...mockTodos[1] }]);
      todoService.todos$.subscribe((todos) => {
        expect(todos.length).toEqual(1);
        expect(todos).toEqual([mockTodos[1]]);
      });
    });
  });

  describe('getTodoID', () => {
    it('should return the todo with the required id', () => {
      todoService.getTodoID(1).subscribe((todo) => {
        expect(todo).toEqual(mockTodos[0]);
      });
    });

    it('should return undefined if id is not present', () => {
      todoService.getTodoID(3).subscribe((todo) => {
        expect(todo).toEqual(undefined);
      });
    });
  });
});

const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Bring Eggs new new new new',
    owner: 'ajit',
    body: 'Need two Dozen eggs for a cake test test',
    media: 'https://supersimple.com/wp-content/uploads/hello-2-1080-740.jpg',
    status: 'todo',
    created: '',
    edited: '',
    deleted: false,
  },
  {
    id: 2,
    title: 'Bring Milk',
    body: 'Need two galon of milk for a cake',
    media: '',
    status: 'todo',
    created: '',
    edited: '',
    deleted: false,
    owner: 'ajit',
  },
];
