import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../service/ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingestion } from '../entities/ingestion.entity';
import { ClientProxy } from '@nestjs/microservices';

describe('IngestionService', () => {
  let service: IngestionService;
  let client: ClientProxy;

  const mockIngestionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn().mockResolvedValue({ id: '123', status: 'completed' }),
  };

  const mockClient = {
    emit: jest.fn().mockReturnValue({ toPromise: () => Promise.resolve(true) }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockIngestionRepository,
        },
        {
          provide: 'INGESTION_SERVICE',
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    client = module.get<ClientProxy>('INGESTION_SERVICE');
  });

  it('should trigger ingestion and emit message', async () => {
    const payload = { source: 'abc.pdf' };
    const result = await service.trigger(payload);

    expect(client.emit).toHaveBeenCalledWith('ingest_document', payload);
    expect(result).toEqual({ success: true });
  });

  it('should return ingestion status', async () => {
    const status = await service.getStatus('123');
    expect(status).toEqual({ status: 'completed', documentId: '123' });
  });
});
