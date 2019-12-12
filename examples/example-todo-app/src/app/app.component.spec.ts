import {Component} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';

@Component({
  selector: 'app-todo-list',
  template: '<div>mock</div>',
})
export class TodoListMockComponent {
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        AppComponent,
        TodoListMockComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Example to-do app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const title = 'Example to-do app';
    expect(app.title).toEqual(title);
  });

});
