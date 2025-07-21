import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../controllers/documents.controller';
import { DocumentsService } from '../service/documents.service';
import { Document } from '../entities/document.entity';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDoc: Document = {
    id: '1',
    filename: 'test.pdf',
    originalName: 'test.pdf',
    mimeType: 'application/pdf',
    path: '/uploads/test.pdf',
    uploadedAt: new Date()
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload a file', async () => {
    mockService.create.mockResolvedValue(mockDoc);
    const result = await controller.uploadFile(mockDoc as any);
    expect(result).toEqual(mockDoc);
  });

  it('should throw exception if upload fails', async () => {
    mockService.create.mockRejectedValue(new Error('Failed'));
    await expect(controller.uploadFile({} as any)).rejects.toThrow('Failed to upload document');
  });

  it('should return all documents', async () => {
    mockService.findAll.mockResolvedValue([mockDoc]);
    expect(await controller.findAll()).toEqual([mockDoc]);
  });

  it('should return a document by ID', async () => {
    mockService.findOne.mockResolvedValue(mockDoc);
    expect(await controller.findOne('1')).toEqual(mockDoc);
  });

  it('should update a document', async () => {
    mockService.update.mockResolvedValue(mockDoc);
    expect(await controller.update('1', { filename: 'new.pdf' })).toEqual(mockDoc);
  });

  it('should delete a document', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await expect(controller.remove('1')).resolves.toBeUndefined();
  });
});
