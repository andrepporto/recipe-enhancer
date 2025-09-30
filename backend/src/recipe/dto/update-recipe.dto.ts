import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateRecipeDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsArray()
  @IsOptional()
  ingredients: string[];

  @IsArray()
  @IsOptional()
  steps: string[];
}
