import { Module } from '@nestjs/common';
import { CategoryProductController } from './category-product.controller';
import { CategoryProductService } from './category-product.service';

@Module({
  controllers: [CategoryProductController],
  providers: [CategoryProductService]
})
export class CategoryProductModule {}
