import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreateTodoDto {
    @ApiProperty({ default: 'To-do Title' })
    @IsString()
    title: string;

    @ApiProperty({ default: 'Lorem Ipsum' })
    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    order?: number;
}
