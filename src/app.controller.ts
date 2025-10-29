import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@nest-extended/core/common/decorators/Public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
