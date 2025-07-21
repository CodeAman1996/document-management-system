import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from '../controllers/ingestion.controller';
import { IngestionService } from '../service/ingestion.service';
import { TriggerIngestionDto } from '../dto/trigger-ingestion.dto';

describe('IngestionController', () => {
  let controller: IngestionController;
  let ingestionService: IngestionService;

  const mockIngestionService = {
    trigger: jest.fn().mockResolvedValue({ success: true }),
    getStatus: jest.fn().mockResolvedValue({ status: 'completed', documentId: '123' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  it('should trigger ingestion', async () => {
    const dto: TriggerIngestionDto = { source: 'test.pdf' };
    const result = await controller.trigger(dto);
    expect(ingestionService.trigger).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ success: true });
  });

  it('should get ingestion status', async () => {
    const result = await controller.getStatus('123');
    expect(ingestionService.getStatus).toHaveBeenCalledWith('123');
    expect(result).toEqual({ status: 'completed', documentId: '123' });
  });
});
