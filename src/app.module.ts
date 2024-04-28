import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { EthereumModule } from './ethereum/ethereum.module';

@Module({
  imports: [FileModule, EthereumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
