import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../service/documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { Repository } from 'typeorm';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let mockRepository: Partial<Repository<Document>>;

  const mockDocument = {
    id: '123',
    filename: 'file.pdf',
    originalName: 'doc.pdf',
    mimeType: 'application/pdf',
    path: '/uploads/file.pdf',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockReturnValue(mockDocument),
      save: jest.fn().mockResolvedValue(mockDocument),
      find: jest.fn().mockResolvedValue([mockDocument]),
      findOneBy: jest.fn().mockResolvedValue(mockDocument),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a document', async () => {
    const createDto = {
      filename: 'file.pdf',
      originalName: 'doc.pdf',
      mimeType: 'application/pdf',
      path: '/uploads/file.pdf',
    };

    const result = await service.create(createDto as any);
    expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    expect(mockRepository.save).toHaveBeenCalledWith(mockDocument);
    expect(result).toEqual(mockDocument);
  });
});
