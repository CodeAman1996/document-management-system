import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingestion } from '../entities/ingestion.entity';
import { Repository } from 'typeorm';
import { TriggerIngestionDto } from '../dto/trigger-ingestion.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepo: Repository<Ingestion>,
    @Inject('PYTHON_SERVICE') private readonly pythonClient: ClientProxy,
  ) {}

  async trigger(dto: TriggerIngestionDto) {
    const ingestion = this.ingestionRepo.create({ source: dto.source });
    await this.ingestionRepo.save(ingestion);

    this.pythonClient.emit('start_ingestion', {
      ingestionId: ingestion.id,
      source: dto.source,
    });

    return ingestion;
  }

  async getStatus(id: string) {
    return this.ingestionRepo.findOneBy({ id });
  }
}
