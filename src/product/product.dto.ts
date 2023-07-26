import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
export class CreateProductDTO {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly title: string;
  @IsNumber()
  @IsString()
  readonly description: string;
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
