import {
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);

    const newFile = await this.FileService.filterFile(files);

    return this.FileService.saveFile(newFile);
  }
}
