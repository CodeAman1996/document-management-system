import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PYTHON_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'ingestion_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class IngestionModule {}