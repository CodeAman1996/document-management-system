import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../service/ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from '../entities/ingestion.entity';
import { ClientProxy } from '@nestjs/microservices';

describe('IngestionService', () => {
  let service: IngestionService;
  let ingestionRepository;
  let pythonClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({
              id: 'test-id',
              documentId: dto.documentId,
              source: dto.source,
              status: dto.status,
              createdAt: new Date(),
              result: dto.result,
            })),
            save: jest.fn().mockImplementation((ingestion) => ingestion),
            findOne: jest.fn().mockResolvedValue({
              id: 'test-id',
              documentId: 'test-document-id',
              source: 'test-source',
              status: 'completed',
              createdAt: new Date(),
              result: 'test-result',
            }),
          },
        },
        {
          provide: 'PYTHON_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    ingestionRepository = module.get(getRepositoryToken(Ingestion));
    pythonClient = module.get('PYTHON_SERVICE');
  });

  it('should trigger ingestion', async () => {
    const result = await service.triggerIngestion(
      'test-document-id',
      'test-source',
    );
    expect(result).toEqual({
      id: 'test-id',
      documentId: 'test-document-id',
      source: 'test-source',
      status: 'pending',
      createdAt: expect.any(Date),
      result: '',
    });
    expect(ingestionRepository.create).toHaveBeenCalledTimes(1);
    expect(ingestionRepository.save).toHaveBeenCalledTimes(1);
    expect(pythonClient.emit).toHaveBeenCalledTimes(1);
  });

  it('should get ingestion status', async () => {
    const result = await service.getIngestionStatus('test-id');
    expect(result).toEqual({
      id: 'test-id',
      documentId: 'test-document-id',
      source: 'test-source',
      status: 'completed',
      createdAt: expect.any(Date),
      result: 'test-result',
    });
    expect(ingestionRepository.findOne).toHaveBeenCalledTimes(1);
  });
});
