import {Component, Input} from '@angular/core';
import {Todo} from './todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  @Input() title: string;

  todos = [
    new Todo('Check out example app', true),
    new Todo('Buy oat drink'),
    new Todo('Rake in the lake'),
  ];

  addTodo() {
    const label = window.prompt('What do you want to do?');
    if (label) {
      this.todos.push(new Todo(label));
    }
  }

  deleteTodo(todoToDelete: Todo) {
    this.todos = this.todos.filter(toDo => toDo !== todoToDelete);
  }

  allDone() {
    return this.todos.every(todo => todo.done);
  }

}
