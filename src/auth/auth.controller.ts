import { Controller, Post, Body, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegistrationDto, UserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Authentication')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({ type: RegistrationDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto, description: 'User successfully registered.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email validation failed' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiBody({ type: RegistrationDto })
  async register(@Body() registerData: RegistrationDto) {
    return this.authService.register(registerData);
  }

  @Post('login')
  @ApiBody({ type: RegistrationDto })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto, description: 'User successfully logged in.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid login credentials.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @ApiBody({ type: RegistrationDto })
  async login(@Body() registerData: RegistrationDto) {
    return this.authService.login(registerData);
  }
}
