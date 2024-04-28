import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { abi, contractAddress } from '../config';
import { nftMetadata } from './nftMetadata.interface';

@Controller()
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Get('nftmetadata/:id.json')
  async getNftMetadata(@Param('id') id: string) {
    try {
      // Вызываем метод контракта getNftMetadata с параметром id
      const methodName = 'getNft';
      const params = [id];

      // Получаем данные из контракта
      const data: nftMetadata = await this.ethereumService.getContractData(
        contractAddress,
        abi,
        methodName,
        params,
      );

      // Отправляем данные в формате JSON в ответ на запрос
      return {
        name: data.name,
        description: data.description,
        image: data.image,
      };
    } catch (error) {
      // Обработка ошибок, например, если контракт не найден или метод не существует
      throw new NotFoundException('Metadata not found');
    }
  }
}
