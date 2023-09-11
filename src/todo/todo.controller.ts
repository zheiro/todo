import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../firebaseAuthGuard';

@Controller('todo')
@ApiTags('Todo')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@UsePipes(new ValidationPipe())
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Successfully created a new todo item.' })
  @ApiBadRequestResponse({ description: 'Validation failed or the request is malformed.' })
  @ApiForbiddenResponse({ description: 'Forbidden. User does not have access.' })
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    const userEmail = req.user.email;
    return this.todoService.create(createTodoDto, userEmail);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Successfully retrieved all todo items.' })
  @ApiForbiddenResponse({ description: 'Forbidden. User does not have access.' })
  findAll(@Request() req) {
    const userEmail = req.user.email;
    return this.todoService.findAll(userEmail);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'The ID of the todo item to retrieve.' })
  @ApiOkResponse({ description: 'Successfully retrieved the todo item by ID.' })
  @ApiNotFoundResponse({ description: 'Todo item not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden. User does not have access.' })
  findOne(@Param('id') id: number, @Request() req) {
    const userEmail = req.user.email;
    return this.todoService.findOne(id, userEmail);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'The ID of the todo item to update.' })
  @ApiResponse({ status: 200, description: 'Successfully updated the todo item.' })
  @ApiNotFoundResponse({ description: 'Todo item not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden. User does not have access.' })
  update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto, @Request() req) {
    const userEmail = req.user.email;
    return this.todoService.update(id, updateTodoDto, userEmail);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'The ID of the todo item to remove.' })
  @ApiResponse({ status: 200, description: 'Successfully removed the todo item.' })
  @ApiNotFoundResponse({ description: 'Todo item not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden. User does not have access.' })
  remove(@Param('id') id: number, @Request() req) {
    const userEmail = req.user.email;
    return this.todoService.remove(id, userEmail);
  }
}