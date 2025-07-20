import {
  Controller,
  Post,
  UploadedFile,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DocumentsService } from '../service/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UploadFileInterceptor } from 'src/common/interceptors/uploadDocs';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @Roles('admin')
  @UploadFileInterceptor()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {

      const metadata: CreateDocumentDto = {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        path: file.path,
      };

      const result = await this.documentsService.create(metadata);
      console.log('Document saved with metadata:', result);
      return result;
    } catch (err) {
      console.error('Error uploading document:', err);
      throw new HttpException(
        'Failed to upload document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Roles('admin')
  async findAll() {
    try {
      console.log('Fetching all documents');
      return await this.documentsService.findAll();
    } catch (err) {
      console.error('Error fetching documents:', err);
      throw new HttpException(
        'Failed to fetch documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @Roles('admin', 'editor', 'viewer')
  async findOne(@Param('id') id: string) {
    try {
      console.log(`Fetching document with id: ${id}`);
      return await this.documentsService.findOne(id);
    } catch (err) {
      console.error(`Error fetching document with id ${id}:`, err);
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @Roles('admin', 'editor', 'viewer')
  async update(@Param('id') id: string, @Body() updateDto: UpdateDocumentDto) {
    try {
      console.log(`Updating document with id: ${id}, Data:`, updateDto);
      return await this.documentsService.update(id, updateDto);
    } catch (err) {
      console.error(`Error updating document with id ${id}:`, err);
      throw new HttpException(
        'Failed to update document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles('admin', 'editor', 'viewer')
  async remove(@Param('id') id: string) {
    try {
      console.log(`Deleting document with id: ${id}`);
      await this.documentsService.remove(id);
      console.log('Document deleted successfully');
      return { message: `Document with id ${id} deleted successfully` };
    } catch (err) {
      console.error(`Error deleting document with id ${id}:`, err);
      throw new HttpException(
        'Failed to delete document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
