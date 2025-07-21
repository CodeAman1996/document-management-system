import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../service/documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: Partial<Repository<Document>>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockDocument: Document = {
    id: '123',
    filename: 'file.pdf',
    originalName: 'doc.pdf',
    mimeType: 'application/pdf',
    path: '/uploads/file.pdf',
    owner: mockUser as any,
    uploadedAt: new Date(),
    ownerId: mockUser.id,
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn().mockReturnValue(mockDocument),
      save: jest.fn().mockResolvedValue(mockDocument),
      find: jest.fn().mockResolvedValue([mockDocument]),
      findOne: jest.fn().mockResolvedValue(mockDocument),
      remove: jest.fn().mockResolvedValue(mockDocument),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a document with userId', async () => {
    const createDto = {
      filename: 'file.pdf',
      originalName: 'doc.pdf',
      mimeType: 'application/pdf',
      path: '/uploads/file.pdf',
    };
    const result = await service.create(createDto as any, 'user-1');
    expect(repository.create).toHaveBeenCalledWith({
      ...createDto,
      ownerId: 'user-1',
    });
    expect(repository.save).toHaveBeenCalledWith(mockDocument);
    expect(result).toEqual(mockDocument);
  });

  it('should return all documents by user', async () => {
    const result = await service.findAllByUser('user-1');
    expect(repository.find).toHaveBeenCalledWith({
      where: { ownerId: 'user-1' },
    });
    expect(result).toEqual([mockDocument]);
  });

  it('should return a document if owned by user', async () => {
    const result = await service.findOne('123', 'user-1');
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
    expect(result).toEqual(mockDocument);
  });

  it('should throw ForbiddenException if user does not own the document', async () => {
    await expect(service.findOne('123', 'user-2')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw NotFoundException if document not found', async () => {
    (repository.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.findOne('999', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a document if user is owner', async () => {
    const updateDto = { filename: 'new.pdf' };
    const result = await service.update('123', updateDto as any, 'user-1');
    expect(result).toEqual(mockDocument);
  });

  it('should delete a document if user is owner', async () => {
    const result = await service.remove('123', 'user-1');
    expect(repository.remove).toHaveBeenCalledWith(mockDocument);
    expect(result).toEqual(mockDocument);
  });

  it('should return all documents by user ID (findAllByUserId)', async () => {
    const result = await service.findAllByUserId('user-1');
    expect(repository.find).toHaveBeenCalledWith({
      where: { ownerId: 'user-1' },
    });
    expect(result).toEqual([mockDocument]);
  });
});
