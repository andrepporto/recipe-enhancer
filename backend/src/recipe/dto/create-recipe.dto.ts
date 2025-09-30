import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  ingredients: string[];

  @IsArray()
  @ArrayNotEmpty()
  steps: string[];
}
