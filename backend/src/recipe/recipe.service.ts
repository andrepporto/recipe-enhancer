import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRecipeDto, userId: string) {
    const recipeData = {
      title: data.title,
      ingredients: data.ingredients,
      steps: data.steps,
      userId:userId,
    };
    return this.prisma.recipe.create({ data: recipeData });
  }

  async findAll() {
    return this.prisma.recipe.findMany();
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  async update(id: string, data: UpdateRecipeDto) {
    return this.prisma.recipe.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.recipe.delete({ where: { id } });
  }

  async transformRecipe(id: string, instruction: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new Error("Receita não encontrada");

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
      Receita original:
      Título: ${recipe.title}
      Ingredientes: ${recipe.ingredients}
      Passos: ${recipe.steps}

      Instrução: ${instruction}

      Gere uma nova versão da receita seguindo a instrução acima.
      Responda em JSON no formato:
      { "title": "...", "ingredients": ["..."], "steps": ["..."] }
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0].message?.content ?? "{}";
    return JSON.parse(content);
  }
}
