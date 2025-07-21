import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, userId: string) {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      ownerId: userId,
    });
    return this.documentsRepository.save(document);
  }

  async findAllByUser(userId: string) {
    return this.documentsRepository.find({ where: { ownerId: userId } });
  }

  async findOne(id: string, userId: string) {
    const document = await this.documentsRepository.findOne({ where: { id } });
    if (!document) throw new NotFoundException('Document not found');
    if (document.ownerId !== userId)
      throw new ForbiddenException('Access to this document is denied');
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, userId: string) {
    const doc = await this.findOne(id, userId);
    Object.assign(doc, updateDocumentDto);
    return this.documentsRepository.save(doc);
  }

  async remove(id: string, userId: string) {
    const doc = await this.findOne(id, userId);
    return this.documentsRepository.remove(doc);
  }

  async findAllByUserId(userId: string) {
  return this.documentsRepository.find({
    where: { ownerId: userId },
  });
}

}
