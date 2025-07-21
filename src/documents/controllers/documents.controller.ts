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
  Request,
} from '@nestjs/common';
import { DocumentsService } from '../service/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UploadFileInterceptor } from 'src/common/interceptors/uploadDocs';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @Roles('admin', 'editor', 'viewer')
  @UploadFileInterceptor()
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully.' })
  @ApiResponse({ status: 500, description: 'Failed to upload document.' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    try {
      const metadata: CreateDocumentDto = {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        path: file.path,
      };

      const result = await this.documentsService.create(
        metadata,
        req.user.userId,
      );
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
  @ApiOperation({ summary: 'Get all documents for current user' })
  @ApiResponse({ status: 200, description: 'List of documents.' })
  @ApiResponse({ status: 500, description: 'Failed to fetch documents.' })
  async findAll(@Request() req) {
    try {
      console.log('Fetching all documents for user:', req.user.userId);
      return await this.documentsService.findAllByUser(req.user.userId);
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
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document found.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      console.log(
        `Fetching document with id: ${id} for user: ${req.user.userId}`,
      );
      return await this.documentsService.findOne(id, req.user.userId);
    } catch (err) {
      console.error(`Error fetching document with id ${id}:`, err);
      throw new HttpException(
        err.message || 'Document not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update a document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({ status: 200, description: 'Document updated successfully.' })
  @ApiResponse({ status: 500, description: 'Failed to update document.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentDto,
    @Request() req,
  ) {
    try {
      console.log(`Updating document ${id} for user ${req.user.userId}`);
      return await this.documentsService.update(id, updateDto, req.user.userId);
    } catch (err) {
      console.error(`Error updating document with id ${id}:`, err);
      throw new HttpException(
        err.message || 'Failed to update document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Delete a document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully.' })
  @ApiResponse({ status: 500, description: 'Failed to delete document.' })
  async remove(@Param('id') id: string, @Request() req) {
    try {
      console.log(`Deleting document ${id} for user ${req.user.userId}`);
      await this.documentsService.remove(id, req.user.userId);
      return { message: `Document with id ${id} deleted successfully` };
    } catch (err) {
      console.error(`Error deleting document with id ${id}:`, err);
      throw new HttpException(
        err.message || 'Failed to delete document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  @Roles('admin', 'viewer')
  @ApiOperation({ summary: 'Get documents by user ID (admin/viewer)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Documents fetched successfully.' })
  @ApiResponse({ status: 500, description: 'Failed to fetch user documents.' })
  async findDocumentsByUserId(@Param('userId') userId: string) {
    try {
      console.log(`Fetching all documents for user ID: ${userId}`);
      return await this.documentsService.findAllByUserId(userId);
    } catch (err) {
      console.error(`Error fetching documents for user ${userId}:`, err);
      throw new HttpException(
        'Failed to fetch documents for user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
