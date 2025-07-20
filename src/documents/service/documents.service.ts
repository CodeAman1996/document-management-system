import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const doc = this.documentRepository.create(createDocumentDto);
    return this.documentRepository.save(doc);
  }

  findAll(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  async findOne(id: string): Promise<Document> {
    const doc = await this.documentRepository.findOneBy({ id });
    if (!doc) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return doc;
  }

  async update(id: string, updateDto: UpdateDocumentDto) {
    if (!updateDto || Object.keys(updateDto).length === 0) {
      throw new BadRequestException('No update data provided.');
    }

    await this.documentRepository.update(id, updateDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.documentRepository.delete(id);
  }
}
