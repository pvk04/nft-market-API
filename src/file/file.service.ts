import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { access, mkdir, writeFile } from 'fs/promises';
import * as sharp from 'sharp';
import { join } from 'path';
import { v4 } from 'uuid';
import { MFile } from './MFile.class';
import { FileResponse } from './file.interface';

@Injectable()
export class FileService {
  async saveFile(files: MFile[]) {
    const uploadFolder = join(__dirname, '..', '..', 'static', 'nft');

    try {
      await access(uploadFolder);
    } catch (error) {
      await mkdir(uploadFolder, { recursive: true });
    }

    const res: FileResponse[] = await Promise.all(
      files.map(async (file): Promise<FileResponse> => {
        try {
          await writeFile(join(uploadFolder, file.originalname), file.buffer);
        } catch (error) {
          throw new InternalServerErrorException('Ошибка записи файла');
        }

        return {
          url: `/static/nft/${file.originalname}`,
          name: file.originalname,
        };
      }),
    );

    return res;
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  async filterFile(files: MFile[]) {
    const newFiles = await Promise.all(
      files.map(async (file) => {
        const mimetype = file.mimetype;
        const currentFileType = file.mimetype.split('/')[1];
        const newName = v4();

        if (mimetype.includes('image')) {
          if (currentFileType != 'svg+xml') {
            const buffer = await this.convertToWebP(file.buffer);

            return new MFile({
              buffer,
              originalname: `${newName}.webp`,
              mimetype,
            });
          }
          return new MFile({
            buffer: file.buffer,
            originalname: `${newName}.svg`,
            mimetype,
          });
        }

        throw new InternalServerErrorException(
          'Файл не соотвестствующего формата',
        );
      }),
    );

    return newFiles;
  }
}
