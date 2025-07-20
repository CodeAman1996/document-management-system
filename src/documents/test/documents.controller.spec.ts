import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../service/documents.service';
import { DocumentsController } from '../controllers/documents.controller';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { HttpException } from '@nestjs/common';
import { UpdateDocumentDto } from '../dto/update-document.dto';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [{ provide: DocumentsService, useValue: mockService }],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  describe('uploadFile', () => {
    it('should upload file and return metadata', async () => {
      const file = {
        filename: 'file.pdf',
        originalname: 'original.pdf',
        mimetype: 'application/pdf',
        path: 'uploads/file.pdf',
      } as Express.Multer.File;

      const createDto: CreateDocumentDto = {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        path: file.path,
      };

      mockService.create.mockResolvedValue({ id: '123', ...createDto });

      const result = await controller.uploadFile(file);
      expect(result).toEqual({ id: '123', ...createDto });
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw exception if upload fails', async () => {
      mockService.create.mockRejectedValue(new Error('Failed'));

      await expect(controller.uploadFile({} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const docs = [{ id: '1' }, { id: '2' }];
      mockService.findAll.mockResolvedValue(docs);
      expect(await controller.findAll()).toEqual(docs);
    });
  });

  describe('findOne', () => {
    it('should return a document by ID', async () => {
      const doc = { id: '1' };
      mockService.findOne.mockResolvedValue(doc);
      expect(await controller.findOne('1')).toEqual(doc);
    });

    it('should throw not found if document missing', async () => {
      mockService.findOne.mockRejectedValue(new Error('not found'));
      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update document', async () => {
      const dto: UpdateDocumentDto = { originalName: 'updated' };
      mockService.update.mockResolvedValue({ id: '1', ...dto });
      expect(await controller.update('1', dto)).toEqual({ id: '1', ...dto });
    });
  });

  describe('remove', () => {
    it('should delete document', async () => {
      mockService.remove.mockResolvedValue(undefined);
      const res = await controller.remove('1');
      expect(res).toEqual({ message: `Document with id 1 deleted successfully` });
    });
  });
});

