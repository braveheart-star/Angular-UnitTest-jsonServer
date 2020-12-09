import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TodoCreateFormComponent } from './todo-create-form.component';

describe('TodoCreateFormComponent', () => {
  let component: TodoCreateFormComponent;
  let fixture: ComponentFixture<TodoCreateFormComponent>;
  const mockFormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    owner: new FormControl('', [Validators.required]),
    body: new FormControl(''),
    media: new FormControl(''),
    status: new FormControl('todo'),
    created: new FormControl(new Date().toISOString()),
    edited: new FormControl(''),
    deleted: new FormControl(false),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoCreateFormComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoCreateFormComponent);
    component = fixture.componentInstance;
    component.todoForm = mockFormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
