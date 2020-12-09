import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodoInterceptor } from './services/interceptors/todo.interceptor';
import { TodoCreateComponent } from './components/todo-create/todo-create.component';
import { TodoCreateFormComponent } from './components/todo-create-form/todo-create-form.component';
import { TodoEditComponent } from './components/todo-edit/todo-edit.component';

const routes: Routes = [
  { path: '', component: TodoComponent },
  { path: 'add', component: TodoCreateComponent },
  { path: 'edit/:id', component: TodoEditComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoComponent,
    TodoCreateComponent,
    TodoCreateFormComponent,
    TodoEditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TodoInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
