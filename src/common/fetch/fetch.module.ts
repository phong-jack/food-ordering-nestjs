import { Module, forwardRef } from '@nestjs/common';
import { FetchService } from './services/fetch.service';
import { HttpModule } from '@nestjs/axios';
import { ShopModule } from 'src/modules/shop/shop.module';

@Module({
  imports: [HttpModule, forwardRef(() => ShopModule)],
  providers: [FetchService],
  exports: [FetchService],
})
export class FetchModule {}
