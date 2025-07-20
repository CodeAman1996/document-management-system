import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../service/documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { Repository } from 'typeorm';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a document', async () => {
    const mockDoc = {
      filename: 'file.pdf',
      originalName: 'doc.pdf',
      mimeType: 'application/pdf',
      path: '/uploads/file.pdf',
    };

    jest.spyOn(repo, 'save').mockResolvedValue(mockDoc as any);
    const result = await service.create(mockDoc as any);
    expect(result).toEqual(mockDoc);
  });
});
