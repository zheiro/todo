import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './interfaces/todo.interface';
import * as admin from 'firebase-admin';
import { ApiNotFoundResponse } from '@nestjs/swagger';

@Injectable()
export class TodoService {
  private db: admin.database.Database;

  constructor() {
    this.db = admin.database();
  }

  async create(createTodoDto: CreateTodoDto, userEmail: string) {
    try {
      const newTodo: Partial<Todo> = {
        ...createTodoDto,
        id: Date.now() //ID is time based
      };

      const emailEncoded = await this.encodeEmail(userEmail);
      const userRef = this.db.ref(`users/${emailEncoded}`);

      const snapshot = await userRef.child('todos').orderByChild('order').limitToLast(1).once('value');
      const lastTodo = snapshot.val();

      let newOrder = 1; //Default

      if (lastTodo) {
        const lastTodoKey = Object.keys(lastTodo)[0];
        const lastOrder = lastTodo[lastTodoKey].order;
        newOrder = lastOrder + 1;
      }

      const createdTodo = { ...newTodo, order: newOrder };
      userRef.child(`todos/${createdTodo.id}`).set(createdTodo);
      return createdTodo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Create Failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(userEmail: string) {
    try {
      const emailEncoded = await this.encodeEmail(userEmail);
      const userRef = this.db.ref(`users/${emailEncoded}`);
      const snapshot = await userRef.child('todos').orderByChild('order').once('value');
      const todoList = snapshot.val();
      //Convert object into array
      const arrayList = Object.keys(todoList || {}).map((key) => todoList[key])

      //Sort by order
      arrayList.sort((a, b) => a.order - b.order);
      return arrayList;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Fetch All Failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number, userEmail: string) {
    try {
      const emailEncoded = await this.encodeEmail(userEmail);
      const todoRef = await this.db.ref(`users/${emailEncoded}/todos/${id}`).once('value');
      const todoRefVal = todoRef.val();
      if (!todoRefVal) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
      }
      return todoRefVal;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Find One Failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userEmail: string) {
    try {
      const emailEncoded = await this.encodeEmail(userEmail);
      const todoRef = this.db.ref(`users/${emailEncoded}/todos/${id}`);
      const todoRefVal = (await todoRef.once('value')).val();
      if (!todoRefVal) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
      }

      const newTodo = {
        ...todoRefVal,
        ...updateTodoDto
      }

      todoRef.set(newTodo);
      return newTodo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Patch Failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number, userEmail: string) {
    try {
      const emailEncoded = await this.encodeEmail(userEmail);
      const todoRef = this.db.ref(`users/${emailEncoded}/todos/${id}`);
      const todoRefVal = (await todoRef.once('value')).val();
      if (!todoRefVal) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
      }

      todoRef.remove();
      return { success: true }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Delete Failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async encodeEmail(email: string): Promise<string> {
    return Buffer.from(email).toString('base64');
  }
}
