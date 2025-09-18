import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRecipeDto) {
    const recipeData = {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      steps: data.steps,
    };
    return this.prisma.recipe.create({ data: recipeData });
  }

  async findAll() {
    return this.prisma.recipe.findMany();
  }

  async findOne(id: string) {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateRecipeDto) {
    return this.prisma.recipe.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
