import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { FirebaseAuthService } from 'src/firebase.auth.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, FirebaseAuthService]
})
export class TodoModule { }
