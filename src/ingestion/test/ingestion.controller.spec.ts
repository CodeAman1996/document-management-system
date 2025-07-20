import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from '../controllers/ingestion.controller';
import { IngestionService } from '../service/ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: {
            triggerIngestion: jest.fn().mockResolvedValue({ success: true }),
            getStatus: jest.fn().mockResolvedValue({ status: 'completed' }),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should trigger ingestion', async () => {
    const result = await controller.trigger({ source: 'abc.pdf' });
    expect(result).toEqual({ success: true });
    expect(service.trigger).toHaveBeenCalledWith({ source: 'abc.pdf' });
  });

  it('should get ingestion status', async () => {
    const status = await controller.getStatus('abc.pdf');
    expect(status).toEqual({ status: 'completed' });
    expect(service.getStatus).toHaveBeenCalledWith('abc.pdf');
  });
});
