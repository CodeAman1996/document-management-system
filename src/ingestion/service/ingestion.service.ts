import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingestion } from '../entities/ingestion.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
    @Inject('PYTHON_SERVICE') private readonly pythonClient: ClientProxy,
  ) {}

  async triggerIngestion(documentId: string, source: string) {
    const ingestion = this.ingestionRepository.create({
      documentId,
      source,
      status: 'pending',
      result: '',
    });
    await this.ingestionRepository.save(ingestion);
    this.pythonClient.emit('start_ingestion', { ingestionId: ingestion.id });
    return ingestion;
  }

  async getIngestionStatus(ingestionId: string) {
    return this.ingestionRepository.findOne({ where: { id: ingestionId } });
  }
}