import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../controllers/documents.controller';
import { DocumentsService } from '../service/documents.service';
import { Document } from '../entities/document.entity';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockDoc: Document = {
    id: '1',
    filename: 'test.pdf',
    originalName: 'test.pdf',
    mimeType: 'application/pdf',
    path: '/uploads/test.pdf',
    uploadedAt: new Date(),
    ownerId: mockUser.id,
    owner: mockUser as any,
  };

  const mockService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = { user: mockUser };

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [{ provide: DocumentsService, useValue: mockService }],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload a file', async () => {
    mockService.create.mockResolvedValue(mockDoc);
    const result = await controller.uploadFile(
      mockDoc as any,
      mockRequest as any,
    );
    expect(result).toEqual(mockDoc);
  });

  it('should throw exception if upload fails', async () => {
    mockService.create.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.uploadFile({} as any, mockRequest as any),
    ).rejects.toThrow('Failed to upload document');
  });

  it('should return all documents for a user', async () => {
    mockService.findAllByUser.mockResolvedValue([mockDoc]);
    const result = await controller.findAll(mockRequest as any);
    expect(result).toEqual([mockDoc]);
  });

  it('should return a document by ID', async () => {
    mockService.findOne.mockResolvedValue(mockDoc);
    const result = await controller.findOne('1', mockRequest as any);
    expect(result).toEqual(mockDoc);
  });

  it('should update a document', async () => {
    mockService.update.mockResolvedValue(mockDoc);
    const result = await controller.update(
      '1',
      { filename: 'new.pdf' },
      mockRequest as any,
    );
    expect(result).toEqual(mockDoc);
  });

  it('should delete a document', async () => {
    mockService.remove.mockResolvedValue({
      message: 'Document with id 1 deleted successfully',
    });
    await expect(controller.remove('1', mockRequest as any)).resolves.toEqual({
      message: 'Document with id 1 deleted successfully',
    });
  });
});
