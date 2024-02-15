import {
  Controller,
  HttpCode,
  Post,
  Get,
  Param,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import * as fs from 'fs';
import { Response } from 'express';
import { join } from 'path';

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

  @Get(':imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    try {
      const imagePath = join(__dirname, '..', '..', 'static', 'nft', imageName);
      if (fs.existsSync(imagePath)) {
        const imageStream = fs.createReadStream(imagePath);
        const imageFormat = imageName.split('.')?.[1];

        if (imageFormat === 'webp') {
          res.setHeader('Content-Type', 'image/webp');
        } else if (imageFormat === 'svg') {
          res.setHeader('Content-Type', 'svg+xml');
        }

        imageStream.pipe(res);
      } else {
        res.status(404).send('Изображение не найдено');
      }
    } catch (error) {
      console.error('Ошибка при отправке изображения:', error);
      res.status(404).send('Изображение не найдено');
    }
  }
}
