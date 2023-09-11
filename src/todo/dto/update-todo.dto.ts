import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';
import { IsOptional, IsNumber } from "class-validator";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {

    @ApiProperty({ default: '1' })
    @IsNumber()
    @IsOptional()
    order?: number;
}
