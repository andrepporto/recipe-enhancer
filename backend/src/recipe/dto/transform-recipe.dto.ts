import { IsNotEmpty, IsString } from "class-validator";

export class TransformRecipeDto {
  @IsString()
  @IsNotEmpty()
  instruction: string;
}