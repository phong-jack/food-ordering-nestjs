import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReviewCreateDto } from '../dtos/review.create.dto';
import { CustomResponse } from 'src/common/decorators/custom-response.interceptor';
import { lastValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { ReviewUpdateDto } from '../dtos/review.update.dto';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(@Inject('REVIEW_SERVICE') private readonly client: ClientProxy) {}

  @CustomResponse({
    message: 'Get reviews success',
    statusCode: HttpStatus.OK,
  })
  @Get()
  async findAll() {
    return await lastValueFrom(this.client.send('review_getAll', {}));
  }

  @CustomResponse({
    message: 'Get review success',
    statusCode: HttpStatus.OK,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await lastValueFrom(this.client.send('review_getOne', id));
  }

  @CustomResponse({
    message: 'Created review success',
    statusCode: HttpStatus.CREATED,
  })
  @Post('create')
  async create(@Body() reviewCreateDto: ReviewCreateDto) {
    return await lastValueFrom(
      this.client.send('review_created', reviewCreateDto),
    );
  }

  @CustomResponse({
    message: 'Updated review',
    statusCode: HttpStatus.OK,
  })
  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() reviewUpdateDto: ReviewUpdateDto,
  ) {
    return await lastValueFrom(
      this.client.send('review_updated', { id, reviewUpdateDto }),
    );
  }

  @CustomResponse({
    message: 'Delete review success',
    statusCode: HttpStatus.OK,
  })
  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    return await lastValueFrom(this.client.send('review_deleted', id));
  }
}
