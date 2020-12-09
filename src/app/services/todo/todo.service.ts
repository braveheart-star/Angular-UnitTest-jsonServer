import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  ConnectableObservable,
  Observable,
  throwError,
} from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { catchError, map, publishLast, switchMap, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject$ = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject$.asObservable();
  constructor(private http: HttpClient) {
    this.getTodos();
  }

  getTodos(): Observable<Todo[]> {
    const todos$ = this.http.get<Todo[]>('todos').pipe(
      catchError((error) => {
        this.todosSubject$.error(error);
        return throwError(error);
      }),
      map((todos) => todos.filter((todo) => !todo.deleted)),
      tap((todos) => this.todosSubject$.next(todos)),
      publishLast()
    );
    (todos$ as ConnectableObservable<Todo[]>).connect();
    return todos$;
  }

  getCurrentTodos(): Todo[] {
    return this.todosSubject$.getValue();
  }

  addTodo(todo: Todo): Observable<string> {
    return this.http.post<Todo>('todos', todo).pipe(
      catchError((error) => {
        this.todosSubject$.error(error);
        return throwError(error);
      }),
      tap((todoRes) =>
        this.todosSubject$.next([...this.getCurrentTodos(), todoRes])
      ),
      map(() => 'Todo Success fully added')
    );
  }

  editTodo(editTodo: Todo): Observable<string> {
    return this.http.put<Todo>(`todos/${editTodo.id}`, editTodo).pipe(
      catchError((error) => {
        this.todosSubject$.error(error);
        return throwError(error);
      }),
      tap((todoRes) => {
        const todoIndex = this.getCurrentTodos().findIndex(
          (todo) => Number(todo.id) === todoRes.id
        );
        const newTodos = this.getCurrentTodos();
        newTodos.splice(todoIndex, 1, todoRes);
        this.todosSubject$.next(newTodos);
      }),
      map(() => 'Todo Successfully updated')
    );
  }

  deleteTodo(editTodo: Todo): Observable<Todo[]> {
    return this.http.put<Todo>(`todos/${editTodo.id}`, editTodo).pipe(
      catchError((error) => {
        this.todosSubject$.error(error);
        return throwError(error);
      }),
      switchMap(() => this.getTodos())
    );
  }

  getTodoID(id: number): Observable<Todo | undefined> {
    return this.todos$.pipe(
      map((todos: Todo[]) => todos.find((todo) => todo.id === id)),
      catchError((error) => {
        this.todosSubject$.error(error);
        return throwError(error);
      })
    );
  }
}
