import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { IngestionService } from '../service/ingestion.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger a document ingestion' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documentId: { type: 'string', example: 'abc123' },
        source: { type: 'string', example: 's3://bucket/file.pdf' },
      },
      required: ['documentId', 'source'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ingestion successfully triggered',
  })
  async triggerIngestion(
    @Body() dto: { documentId: string; source: string },
  ) {
    return this.ingestionService.triggerIngestion(dto.documentId, dto.source);
  }

  @Get(':ingestionId/status')
  @ApiOperation({ summary: 'Get ingestion status by ID' })
  @ApiParam({
    name: 'ingestionId',
    description: 'ID of the ingestion process',
    example: '1a2b3c4d',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestion status fetched successfully',
  })
  async getIngestionStatus(@Param('ingestionId') ingestionId: string) {
    return this.ingestionService.getIngestionStatus(ingestionId);
  }
}
