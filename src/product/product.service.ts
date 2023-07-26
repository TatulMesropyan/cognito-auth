import { Injectable } from '@nestjs/common';
import { Product, ProductType } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductType>,
  ) {}

  async createProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description,
      price,
    });
    this.products.push(newProduct);
    await newProduct.save();
  }
  async getAllProducts() {
    const allProducts = await this.productModel.find().exec();
    return allProducts;
  }
  async deleteByPrice(price: number) {
    const allProducts = await this.productModel.findOneAndDelete({ price });
    return allProducts;
  }
}
