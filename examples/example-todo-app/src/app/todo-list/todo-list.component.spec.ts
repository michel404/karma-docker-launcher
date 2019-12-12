import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

import {TodoListComponent} from './todo-list.component';

describe('TodoListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatIconModule,
        MatListModule,
      ],
      declarations: [
        TodoListComponent,
      ],
    })
      .compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when the add button is clicked', () => {
    const newToDO = 'new todo';
    let fixture: ComponentFixture<TodoListComponent>;
    let oldLength: number;

    beforeEach(() => {
      spyOn(window, 'prompt').and.returnValue(newToDO);
      fixture = TestBed.createComponent(TodoListComponent);
      fixture.detectChanges();
      oldLength = fixture.componentInstance.todos.length;

      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('button[mat-raised-button]').click();
    });

    it('should open a prompt when the button is', () => {
      expect(window.prompt).toHaveBeenCalled();
    });

    it('should add the new to-do to the list', () => {
      expect(fixture.componentInstance.todos.length).toBe(oldLength + 1);
      expect(fixture.componentInstance.todos.pop().label).toBe(newToDO);
    });

  });

  describe('when the delete link is clicked', () => {
    let fixture: ComponentFixture<TodoListComponent>;
    let oldLength: number;

    beforeEach(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      fixture.detectChanges();
      oldLength = fixture.componentInstance.todos.length;

      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('button.delete').click();
    });

    it('should remove a to-do state', () => {
      expect(fixture.componentInstance.todos.length).toBe(oldLength - 1);
    });

  });
  it('should create', () => {
    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when the add button is clicked', () => {
    const newToDO = 'new todo';
    let fixture: ComponentFixture<TodoListComponent>;
    let oldLength: number;

    beforeEach(() => {
      spyOn(window, 'prompt').and.returnValue(newToDO);
      fixture = TestBed.createComponent(TodoListComponent);
      fixture.detectChanges();
      oldLength = fixture.componentInstance.todos.length;

      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('button[mat-raised-button]').click();
    });

    it('should open a prompt when the button is', () => {
      expect(window.prompt).toHaveBeenCalled();
    });

    it('should add the new to-do to the list', () => {
      expect(fixture.componentInstance.todos.length).toBe(oldLength + 1);
      expect(fixture.componentInstance.todos.pop().label).toBe(newToDO);
    });

  });

  describe('when the delete link is clicked', () => {
    let fixture: ComponentFixture<TodoListComponent>;
    let oldLength: number;

    beforeEach(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      fixture.detectChanges();
      oldLength = fixture.componentInstance.todos.length;

      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('button.delete').click();
    });

    it('should remove a to-do state', () => {
      expect(fixture.componentInstance.todos.length).toBe(oldLength - 1);
    });

  });

});
