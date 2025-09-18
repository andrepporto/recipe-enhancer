import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  ingredients: string[];

  @IsArray()
  @ArrayNotEmpty()
  steps: string[];
}
