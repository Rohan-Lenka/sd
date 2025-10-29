import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    console.log(file);
    console.log(type);
    if (!file) throw new BadRequestException('No file provided');
    if (!type) throw new BadRequestException('No type provided');

    const key = await this.fileUploadService.uploadFile(file, type);
    return { key };
  }
}
