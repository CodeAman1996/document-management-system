import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../service/ingestion.service';
import { ClientProxy } from '@nestjs/microservices';

describe('IngestionService', () => {
  let service: IngestionService;
  let client: ClientProxy;

  beforeEach(async () => {
    const mockClient = {
      emit: jest.fn().mockReturnValue({ toPromise: () => Promise.resolve(true) }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
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
