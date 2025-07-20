import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { IngestionService } from '../service/ingestion.service';
import { TriggerIngestionDto } from '../dto/trigger-ingestion.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  async trigger(@Body() dto: TriggerIngestionDto) {
    return this.ingestionService.trigger(dto);
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: string) {
    return this.ingestionService.getStatus(id);
  }
}
