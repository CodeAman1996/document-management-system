import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from '../controllers/ingestion.controller';
import { IngestionService } from '../service/ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: {
            triggerIngestion: jest.fn().mockResolvedValue({
              id: 'test-id',
              documentId: 'test-document-id',
              source: 'test-source',
              status: 'pending',
              createdAt: new Date(),
              result: null,
            }),
            getIngestionStatus: jest.fn().mockResolvedValue({
              id: 'test-id',
              documentId: 'test-document-id',
              source: 'test-source',
              status: 'completed',
              createdAt: new Date(),
              result: 'test-result',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should trigger ingestion', async () => {
    const result = await controller.triggerIngestion({
      documentId: 'test-document-id',
      source: 'test-source',
    });
    expect(result).toEqual({
      id: 'test-id',
      documentId: 'test-document-id',
      source: 'test-source',
      status: 'pending',
      createdAt: expect.any(Date),
      result: null,
    });
    expect(service.triggerIngestion).toHaveBeenCalledTimes(1);
  });

  it('should get ingestion status', async () => {
    const result = await controller.getIngestionStatus('test-id');
    expect(result).toEqual({
      id: 'test-id',
      documentId: 'test-document-id',
      source: 'test-source',
      status: 'completed',
      createdAt: expect.any(Date),
      result: 'test-result',
    });
    expect(service.getIngestionStatus).toHaveBeenCalledTimes(1);
  });
});