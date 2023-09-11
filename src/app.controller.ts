import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() request: Request, @Res() response: Response): void {
    const welcomeMessage = this.appService.getWelcomeMessage(request);
    response.send(welcomeMessage);
  }
}