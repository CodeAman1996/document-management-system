import { Module } from '@nestjs/common';
import { IngestionService } from './service/ingestion.service';
import { IngestionController } from './controllers/ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingestion]),
    ClientsModule.register([
      {
        name: 'PYTHON_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4001 },
      },
    ]),
  ],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
