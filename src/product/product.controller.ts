import { Controller, Post, Get, Body, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductType } from './product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    return this.productService.createProduct(title, description, price);
  }

  @Get()
  async getAllProducts() {
    const allProds = await this.productService.getAllProducts();
    return allProds;
  }
  @Delete()
  async deleteByPrice(@Body('price') price: number) {
    await this.productService.deleteByPrice(price);
  }
}
