import { BehaviorSubject, Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

export const mockTodos: Todo[] = [
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
export class MockTodoService {
  private todosSubject$ = new BehaviorSubject<Todo[]>(mockTodos);
  todos$ = this.todosSubject$.asObservable();

  deleteTodo(todo: Todo): Observable<Todo[]> {
    const deletedTodo = mockTodos.find((mockTodo) => mockTodo.id === todo.id);
    if (deletedTodo) {
      deletedTodo.deleted = true;
    }
    return this.todos$;
  }

  addTodo(todo: Todo): Observable<string> {
    this.todosSubject$.next([...mockTodos, todo]);
    return of('Todo Success fully added');
  }

  editTodo(editTodo: Todo): Observable<string> {
    const todoIndex = mockTodos.findIndex(
      (todo) => Number(todo.id) === editTodo.id
    );
    mockTodos.splice(todoIndex, 1, editTodo);
    this.todosSubject$.next([...mockTodos]);
    return of('Todo Successfully updated');
  }

  getTodoID(id: number): Observable<Todo | undefined> {
    return of(mockTodos.find((todo) => todo.id === id));
  }
}
